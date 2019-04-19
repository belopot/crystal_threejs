var container;
var camera, cubeCamera1, cubeCamera2, cameraRoot, scene, renderer, composer, clock;
var sCrystalMaterial;
var lCrystalMaterial;
var logoCrystal;
var partialCrystals = [];
var partialCrystalRoots = [];
var partialCrystalAngleSpeeds = [];
var partialCrystalRootAngleSpeeds = [];
var initPositionOfPartialCrystals = [];
var initScaleOfPartialCrystals = [];
var crystalParent;
var partialCrystalCount = 150;

var isMobile = false;

//Loading
var loadingContainer;
var loadingPercent;
var loaded = false;

//Holder
var holderContainer;

//Camera Animation
var targetRotationX = 0;
var targetRotationY = 0;
var targetRotationXOnMouseDown = 0;
var targetRotationYOnMouseDown = 0;
var mouseX = 0;
var mouseY = 0;
var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var isMouseDown = false;
var oldDownPosX = 0;
var oldDownPosY = 0;
var firstDown = true;

var useTsu = true;
//Shader
var useShader = false;
var envMap;

var sCrystalShaderMat;
var sCrystalVertexShader;
var sCrystalfragmentShader;
var sCrystalDiffuseMap;
var sCrystalAlphaMap;
var sCrystalSpecularMap;
var sCrystalNormalMap;
var sCrystalBumpMap;
var sCrystalRadius;

var lCrystalShaderMat;
var lCrystalVertexShader;
var lCrystalfragmentShader;
var lCrystalDiffuseMap;
var lCrystalAlphaMap;
var lCrystalSpecularMap;
var lCrystalNormalMap;
var lCrystalBumpMap;

var envSphere;
var lightPosition = new THREE.Vector3(0, 0, 0);
var startTime;

//Gather mesh
var downTimer = 0;
var accelTimerForRootAngle = 0;

var State = {
    Laround: 1,
    Lgather: 2,
    Saround: 3,
    Sgather: 4,
    Logo: 5,
    End: 6,
    times: {
        1: { value: 4 },
        2: { value: 13.0 },
        3: { value: 6.6 },
        4: { value: 3 },
        5: { value: 4 },
        6: { value: 0 },
    }
};

var currentState = State.Laround;

function getRandomScale(low, high) {
    return getRandom() * (high - low) + low
};

function distanceVector(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

function getRandom() {
    return (Math.random() + Math.random() + Math.random() + Math.random()) / 4
}


function mobileAndTabletcheck() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

init();
animate();

function init() {

    container = document.getElementById('container');
    loadingContainer = document.getElementById('loading');
    loadingPercent = document.getElementById('percent');
    holderContainer = document.getElementById('holder');
    sCrystalVertexShader = "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float animationParam1;\nuniform float animationParam2;\nuniform float animationParam3;\nuniform float time;\nuniform float lightValueParam;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute float vertexRandomValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nfloat map_2_1(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\n// #pragma glslify: snoise3 = require('glsl-noise/simplex/3d')\nfloat exponentialOut_3_2(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\n\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backOut_4_3(float t) {\n  float f = 1.0 - t;\n  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));\n}\n\n\n\n\n\nfloat getAnimationParam(float value, float randomValue) {\n  float r = randomValue * 0.4;\n  return map_2_1(value, r, r + 0.6, 0.0, 1.0, true);\n}\n\nvoid main() {\n  vec3 pos = position;\n  pos *= exponentialOut_3_2(getAnimationParam(animationParam1, vertexRandomValue));\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n  float t = mod(time, 20000.0 * PI_1_0);\n  modelPos.x += animationParam3 * 0.1 * sin(t * 200.0);\n  modelPos.y += animationParam3 * 0.1 * sin(t * 400.0);\n  modelPos.z += animationParam3 * 0.1 * sin(t * 600.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = (1.0 - animationParam2);\n  float len = length(position.xyz);\n  vLightValue = min(lightValueParam / len / len * (0.6 + vertexRandomValue * 0.4), 0.6);\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n";
    // sCrystalVertexShader = "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float time;\nuniform float radius;\nuniform float radiusRatio;\nuniform float rotationSpeed;\nuniform float animationParam1;\nuniform float animationParam2;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec3 randomValues;\nattribute vec3 offset;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nvec3 rotateVec3_2_1(vec3 p, float angle, vec3 axis){\n  vec3 a = normalize(axis);\n  float s = sin(angle);\n  float c = cos(angle);\n  float r = 1.0 - c;\n  mat3 m = mat3(\n    a.x * a.x * r + c,\n    a.y * a.x * r + a.z * s,\n    a.z * a.x * r - a.y * s,\n    a.x * a.y * r - a.z * s,\n    a.y * a.y * r + c,\n    a.z * a.y * r + a.x * s,\n    a.x * a.z * r + a.y * s,\n    a.y * a.z * r - a.x * s,\n    a.z * a.z * r + c\n  );\n  return m * p;\n}\n\n\nfloat map_3_2(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\n\nconst float PI2 = 2.0 * PI_1_0;\n\nconst vec3 axisX = vec3(1.0, 0.0, 0.0);\nconst vec3 axisY = vec3(0.0, 1.0, 0.0);\nconst vec3 axisZ = vec3(0.0, 0.0, 1.0);\n\nvoid main() {\n  vec3 pos = position;\n  vec3 pos1 = vec3(0.0);\n  vec3 pos2 = vec3(0.0);\n  vec3 n = normal;\n  vec3 n1 = normal;\n  vec3 n2 = normal;\n  float p1 = animationParam1;\n  float p2 = animationParam2;\n\n  // pos *= (1.0 - animationParam2 * 0.6);\n\n  float theta1Base = -time * 0.04 / 180.0 * PI_1_0 * randomValues.x;\n  float theta2Base = -time * 0.04 / 180.0 * PI_1_0 * randomValues.z;\n  float theta1 = theta1Base + randomValues.y * PI2 * 2.0;\n  float theta2 = theta2Base + randomValues.x * PI2 * 2.0;\n  pos = rotateVec3_2_1(pos, theta1, axisX);\n    n = rotateVec3_2_1(  n, theta1, axisX);\n  pos = rotateVec3_2_1(pos, theta2, axisZ);\n    n = rotateVec3_2_1(  n, theta2, axisZ);\n\n  n1 = n;\n  pos1.x += radius * randomValues.x * radiusRatio;\n  theta1 = theta1Base * rotationSpeed + randomValues.y * PI2 * 10.0;\n  theta2 = theta2Base * rotationSpeed + randomValues.x * PI2 * 10.0;\n  pos1 = rotateVec3_2_1(pos1, theta1, axisZ);\n    n1 = rotateVec3_2_1(  n1, theta1, axisZ);\n  pos1 = rotateVec3_2_1(pos1, theta2, axisY);\n    n1 = rotateVec3_2_1(  n1, theta2, axisY);\n\n  n2 = n;\n  pos2.x += (radius * 0.14 + radius * 0.2 * randomValues.x) * (1.0 - p2) + radius * 0.02 * p2;\n  // pos2.y += offset.y * (1.0 - p2) * 0.4;\n  theta1 = theta1 * 40.0;\n  theta2 = theta2 * 40.0;\n  pos2 = rotateVec3_2_1(pos2, theta1, axisZ);\n    n2 = rotateVec3_2_1(  n2, theta1, axisZ);\n  pos2 = rotateVec3_2_1(pos2, theta2, axisY);\n    n2 = rotateVec3_2_1(  n2, theta2, axisY);\n\n  pos += mix(pos1, pos2, p1);\n  n = mix(n1, n2, p1);\n\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(n, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = animationParam2;\n  vLightValue = 0.0;\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n"
    sCrystalfragmentShader = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform samplerCube envMap;\nuniform sampler2D alphaMap;\nuniform sampler2D bumpMap;\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform float bumpRefraction;\n\nuniform mat4 matrixWorldInverse;\nuniform float refractionRatio;\nuniform vec3 lightPosition;\nuniform float alphaValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nvoid main(){\n  vec3 tBinormal = cross(vNormal, vTangent);\n  mat3 mView = mat3(vTangent, tBinormal, vNormal);\n\n  vec3 normal = mView * (normalize(texture2D(normalMap, vUv)) * 2.0 - 1.0).rgb;\n  vec4 specular = texture2D(specularMap, vUv);\n  specular.rgb *= 0.4;\n\n  vec3 invLight = normalize(matrixWorldInverse * vec4(lightPosition, 0.0)).xyz;\n  vec4 diffuse  = vec4(vec3(clamp(dot(normal, invLight), 0.1, 1.0)) * 3.0, 1.0);\n  vec4 bump = texture2D(bumpMap, vUv);\n\n  float alpha = texture2D(alphaMap, vUv).r;\n\n  float b = refractionRatio;\n  if(bumpRefraction == 1.0) {\n    b *= bump.g * 0.4;\n  }\n  vec3 ref = refract(normalize(vPos - vCameraPos), normal, b);\n  vec4 envColor = textureCube(envMap, ref);\n\n  vec4 destColor = diffuse * envColor * vColor;\n  destColor.a = alpha / alphaValue + alpha * vColorAnimationParam + vLightValue;\n  destColor.rgb += vColorAnimationParam + vLightValue;\n  gl_FragColor = destColor;\n}\n";
    lCrystalVertexShader = "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float animationParam1;\nuniform float animationParam2;\nuniform float animationParam3;\nuniform float time;\nuniform float lightValueParam;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute float vertexRandomValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nfloat map_2_1(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\n// #pragma glslify: snoise3 = require('glsl-noise/simplex/3d')\nfloat exponentialOut_3_2(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\n\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backOut_4_3(float t) {\n  float f = 1.0 - t;\n  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));\n}\n\n\n\n\n\nfloat getAnimationParam(float value, float randomValue) {\n  float r = randomValue * 0.4;\n  return map_2_1(value, r, r + 0.6, 0.0, 1.0, true);\n}\n\nvoid main() {\n  vec3 pos = position;\n  pos *= exponentialOut_3_2(getAnimationParam(animationParam1, vertexRandomValue));\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n  float t = mod(time, 20000.0 * PI_1_0);\n  modelPos.x += animationParam3 * 0.1 * sin(t * 200.0);\n  modelPos.y += animationParam3 * 0.1 * sin(t * 400.0);\n  modelPos.z += animationParam3 * 0.1 * sin(t * 600.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = (1.0 - animationParam2);\n  float len = length(position.xyz);\n  vLightValue = min(lightValueParam / len / len * (0.6 + vertexRandomValue * 0.4), 0.6);\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n";
    lCrystalfragmentShader = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform samplerCube envMap;\nuniform sampler2D alphaMap;\nuniform sampler2D bumpMap;\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform float bumpRefraction;\n\nuniform mat4 matrixWorldInverse;\nuniform float refractionRatio;\nuniform vec3 lightPosition;\nuniform float alphaValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nvoid main(){\n  vec3 tBinormal = cross(vNormal, vTangent);\n  mat3 mView = mat3(vTangent, tBinormal, vNormal);\n\n  vec3 normal = mView * (normalize(texture2D(normalMap, vUv)) * 2.0 - 1.0).rgb;\n  vec4 specular = texture2D(specularMap, vUv);\n  specular.rgb *= 0.4;\n\n  vec3 invLight = normalize(matrixWorldInverse * vec4(lightPosition, 0.0)).xyz;\n  vec4 diffuse  = vec4(vec3(clamp(dot(normal, invLight), 0.1, 1.0)) * 3.0, 1.0);\n  vec4 bump = texture2D(bumpMap, vUv);\n\n  float alpha = texture2D(alphaMap, vUv).r;\n\n  float b = refractionRatio;\n  if(bumpRefraction == 1.0) {\n    b *= bump.g * 0.4;\n  }\n  vec3 ref = refract(normalize(vPos - vCameraPos), normal, b);\n  vec4 envColor = textureCube(envMap, ref);\n\n  vec4 destColor = diffuse * envColor * vColor;\n  destColor.a = alpha / alphaValue + alpha * vColorAnimationParam + vLightValue;\n  destColor.rgb += vColorAnimationParam + vLightValue;\n  gl_FragColor = destColor;\n}\n";

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Import model
    /////////////////////////////////////////////////////////////////////////////////////////////
    var manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        /////////////////////////////////////////////////////////////////////////////////////////////
        //Scene
        //////////////////////////////////////////////////////////////////////////////////////////////
        scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x000b1b);
        // scene.background = new THREE.Color(0x0015ff);

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Renderer
        //////////////////////////////////////////////////////////////////////////////////////////////
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        renderer.autoClear = false;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Camera
        //////////////////////////////////////////////////////////////////////////////////////////////
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 3000);
        camera.position.z = 135;
        camera.position.y = 2;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        cameraRoot = new THREE.Object3D();
        cameraRoot.add(camera);
        scene.add(cameraRoot);

        if (useShader) {
            cubeCamera1 = new THREE.CubeCamera(1, 1000, 512);
            cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            cubeCamera2 = new THREE.CubeCamera(1, 1000, 512);
            cubeCamera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            cubeCamera1.position.set(0, 0, 135);
            cubeCamera1.position.set(0, 0, 135);
            scene.add(cubeCamera1);
            scene.add(cubeCamera2);
        }


        //////////////////////////////////////////////////////////////////////////////////////////////
        //Light
        //////////////////////////////////////////////////////////////////////////////////////////////
        if (!useShader) {
            ambientLight = new THREE.AmbientLight(0x0000ff);
            ambientLight.intensity = 100;
            scene.add(ambientLight);
            directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 30, -1);
            scene.add(directionalLight);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Clock
        //////////////////////////////////////////////////////////////////////////////////////////////
        clock = new THREE.Clock();

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Effects
        /////////////////////////////////////////////////////////////////////////////////////////////
        // var renderModel = new THREE.RenderPass(scene, camera);
        // var effectBloom = new THREE.BloomPass(1.4);
        // var effectFilm = new THREE.FilmPass(0.1, 0.1, 2048, false);
        // effectFilm.renderToScreen = true;

        // composer = new THREE.EffectComposer(renderer);
        // composer.addPass(renderModel);
        // composer.addPass(effectBloom);
        // composer.addPass(effectFilm);

        isMobile = mobileAndTabletcheck()
    };

    manager.onLoad = function () {

        // console.log('Loading complete!');
        loadingContainer.classList.add("loaded");
        loaded = true;

        startTime = (new Date).getTime();

        sCrystalShaderMat = new THREE.RawShaderMaterial({
            vertexShader: sCrystalVertexShader,
            fragmentShader: sCrystalfragmentShader,
            transparent: true,
            uniforms: {
                alphaMap: {
                    type: "t",
                    value: sCrystalAlphaMap
                },
                bumpMap: {
                    type: "t",
                    value: sCrystalBumpMap
                },
                envMap: {
                    type: "t",
                    value: envMap
                },
                normalMap: {
                    type: "t",
                    value: sCrystalNormalMap
                },
                normalScale: {
                    type: "2f",
                    value: new THREE.Vector2(0.3, 0.3)
                },
                specularMap: {
                    type: "t",
                    value: sCrystalSpecularMap
                },
                time: {
                    type: "1f",
                    value: null
                },
                refractionRatio: {
                    type: "1f",
                    value: 0.4
                },
                matrixWorldInverse: {
                    type: "m4",
                    value: null
                },
                lightPosition: {
                    type: "3f",
                    value: null
                },
                bumpRefraction: {
                    type: "1f",
                    value: 1
                },
                radius: {
                    type: "1f",
                    value: 0
                },
                rotationSpeed: {
                    type: "1f",
                    value: .0
                },
                alphaValue: {
                    type: "1f",
                    value: .4
                },
                animationParam1: {
                    type: "1f",
                    value: 0
                },
                animationParam2: {
                    type: "1f",
                    value: 0
                },
                lightValueParam: {
                    type: "1f",
                    value: 0
                }
            }
        });

        for (let i = 0; i < partialCrystalCount; i++) {
            partialCrystals[i].traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    let isMarker = child.name.includes("photo");
                    if (isMarker) {
                        child.visible = false;
                    }
                    else {
                        child.material = useShader ? sCrystalShaderMat : sCrystalMaterial;
                    }

                }
            });
        }


        lCrystalShaderMat = new THREE.RawShaderMaterial({
            vertexShader: lCrystalVertexShader,
            fragmentShader: lCrystalfragmentShader,
            transparent: true,
            uniforms: {
                alphaMap: {
                    type: "t",
                    value: lCrystalAlphaMap
                },
                bumpMap: {
                    type: "t",
                    value: lCrystalBumpMap
                },
                envMap: {
                    type: "t",
                    value: envMap
                },
                normalMap: {
                    type: "t",
                    value: lCrystalNormalMap
                },
                normalScale: {
                    type: "2f",
                    value: new THREE.Vector2(0.3, 0.3)
                },
                specularMap: {
                    type: "t",
                    value: lCrystalSpecularMap
                },
                time: {
                    type: "1f",
                    value: null
                },
                refractionRatio: {
                    type: "1f",
                    value: 0.4
                },
                matrixWorldInverse: {
                    type: "m4",
                    value: null
                },
                lightPosition: {
                    type: "3f",
                    value: null
                },
                bumpRefraction: {
                    type: "1f",
                    value: 1
                },
                alphaValue: {
                    type: "1f",
                    value: .4
                },
                animationParam1: {
                    type: "1f",
                    value: 0
                },
                animationParam2: {
                    type: "1f",
                    value: 0
                },
                animationParam3: {
                    type: "1f",
                    value: 0
                },
                lightValueParam: {
                    type: "1f",
                    value: 0
                }
            }
        });

        logoCrystal.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                let size = 0.15;
                child.scale.set(size, size, size);
                child.material = useShader ? lCrystalShaderMat : lCrystalMaterial;
            }
        });
        logoCrystal.scale.set(0.3, 0.3, 0.3);
    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        loadingPercent.textContent = Math.floor(itemsLoaded * 100 / itemsTotal);

    };

    manager.onError = function (url) {

        // console.log('There was an error loading ' + url);

    };

    var textureLoader = new THREE.TextureLoader(manager);

    var texturePath = useTsu ? "Assets/texture/tsu/" : "Assets/texture/";
    envMap = textureLoader.load(texturePath + "env.jpg");
    sCrystalDiffuseMap = textureLoader.load(texturePath + "diffuse.jpg");
    sCrystalAlphaMap = textureLoader.load(texturePath + "alpha.jpg");
    sCrystalSpecularMap = textureLoader.load(texturePath + "specular.jpg");
    sCrystalNormalMap = textureLoader.load(texturePath + "normal.jpg");
    sCrystalBumpMap = textureLoader.load(texturePath + "bump.jpg");

    lCrystalDiffuseMap = textureLoader.load("Assets/texture/" + "logo/diffuse.jpg");
    lCrystalAlphaMap = textureLoader.load("Assets/texture/" + "logo/alpha.jpg");
    lCrystalSpecularMap = textureLoader.load("Assets/texture/" + "logo/specular.jpg");
    lCrystalNormalMap = textureLoader.load("Assets/texture/" + "logo/normal.jpg");
    lCrystalBumpMap = textureLoader.load("Assets/texture/" + "logo/bump.jpg");

    envSphere = new THREE.Mesh(
        new THREE.SphereGeometry(120, 32, 16),
        new THREE.MeshBasicMaterial({
            map: textureLoader.load(texturePath + "env.jpg"),
            side: THREE.DoubleSide,
        })
    );
    envSphere.scale.x *= -1;
    scene.add(envSphere)
    envSphere.visible = false;

    //Crystal Material
    sCrystalMaterial = new THREE.MeshPhysicalMaterial({
        // color: 0x0000ff,
        // emissive: 0xffffff,
        roughness: 0.001,
        metalness: 0.9,
        reflectivity: 0.5,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        envMapIntensity: 1,
        envMaps: envMap,
        premultipliedAlpha: true,
        map: sCrystalDiffuseMap,
        alphaMap: sCrystalAlphaMap,
        specularMap: sCrystalSpecularMap,
        normalMap: sCrystalNormalMap,
        bumpMap: sCrystalBumpMap,
        normalScale: new THREE.Vector2(1.7, 1.7),
    });

    lCrystalMaterial = new THREE.MeshPhysicalMaterial({
        // color: 0x0000ff,
        // emissive: 0xffffff,
        roughness: 0.005,
        metalness: 0.8,
        reflectivity: 0.5,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        envMapIntensity: 3.3,
        envMaps: envMap,
        premultipliedAlpha: true,
        map: lCrystalDiffuseMap,
        alphaMap: lCrystalAlphaMap,
        specularMap: lCrystalSpecularMap,
        normalMap: lCrystalNormalMap,
        bumpMap: lCrystalBumpMap,
        normalScale: new THREE.Vector2(1.7, 1.7),
    });

    if (!useShader) {
        var genCubeUrls = function (prefix, postfix) {
            return [
                prefix + 'px' + postfix, prefix + 'nx' + postfix,
                prefix + 'py' + postfix, prefix + 'ny' + postfix,
                prefix + 'pz' + postfix, prefix + 'nz' + postfix
            ];
        };
        var hdrUrls = genCubeUrls("Assets/texture/hdr/", ".hdr");
        new THREE.HDRCubeTextureLoader(manager).load(THREE.UnsignedByteType, hdrUrls, function (hdrCubeMap) {
            var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap);
            pmremGenerator.update(renderer);
            var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
            pmremCubeUVPacker.update(renderer);
            hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
            sCrystalMaterial.envMap = hdrCubeRenderTarget.texture;
            sCrystalMaterial.needsUpdate = true;
            lCrystalMaterial.envMap = hdrCubeRenderTarget.texture;
            lCrystalMaterial.needsUpdate = true;
            hdrCubeMap.dispose();
            pmremGenerator.dispose();
            pmremCubeUVPacker.dispose();
        });
    }

    //Logo Model
    var modelPath = useTsu ? "Assets/model/tsu/" : "Assets/model/";
    new THREE.OBJLoader(manager).setPath("Assets/model/").load('logo.obj', function (object) {
        logoCrystal = object;
        logoCrystal.visible = false;
        crystalParent.add(logoCrystal);
    });

    //Partial Model
    crystalParent = new THREE.Object3D()
    let largeCrystalSize = useTsu ? 0.0025 : 0.3;
    let smallsCrystalSize = useTsu ? 0.0025 : 0.7;
    let partialCrystalIdx = [];
    let largeCrystalPercent = useTsu ? 0.6 : 0.4;
    let largeCrystalEndIdx = Math.floor(partialCrystalCount * largeCrystalPercent);
    for (let i = 0; i < largeCrystalEndIdx; i++) {
        partialCrystalIdx.push(Math.floor(getRandomScale(1, 6)));
    }
    for (let i = largeCrystalEndIdx; i < partialCrystalCount; i++) {
        partialCrystalIdx.push(Math.floor(getRandomScale(7, 11)));
    }
    for (let i = 0; i < partialCrystalCount; i++) {
        new THREE.OBJLoader(manager).setPath(modelPath).load(partialCrystalIdx[i] + '.obj', function (object) {
            //Random point within sphere uniformly
            let symbolX = getRandomScale(-1, 1);
            symbolX = symbolX >= 0 ? 1 : -1;
            let symbolY = getRandomScale(-1, 1);
            symbolY = symbolY >= 0 ? 1 : -1;

            let alpha = 2 * Math.PI * getRandom();
            let beta = getRandomScale(-2 * Math.PI, 2 * Math.PI);

            let ua = getRandomScale(50, 120);

            let rx = symbolX * ua * Math.cos(alpha);
            let ry = symbolY * ua * Math.sin(alpha);
            let rz = 0;
            let partialCrystal = object;

            scene.add(partialCrystal);
            partialCrystal.position.set(rx, ry, rz);
            partialCrystal.scale.set(i < largeCrystalEndIdx ? largeCrystalSize : smallsCrystalSize, i < largeCrystalEndIdx ? largeCrystalSize : smallsCrystalSize, i < largeCrystalEndIdx ? largeCrystalSize : smallsCrystalSize);

            partialCrystal.rotation.set(getRandomScale(-40, 40), getRandomScale(-40, 40), getRandomScale(-40, 40));

            partialCrystals.push(partialCrystal);

            let partialCrystalRoot = new THREE.Object3D();
            scene.add(partialCrystalRoot);
            partialCrystalRoot.add(partialCrystal);
            partialCrystalRoot.position.set(0, 0, 0);
            partialCrystalRoot.rotation.set(0, beta, 0);
            partialCrystalRoots.push(partialCrystalRoot);

            crystalParent.add(partialCrystalRoot);
            scene.add(crystalParent);

            partialCrystalRoot.updateMatrixWorld();
            let p = new THREE.Vector3();
            partialCrystal.getWorldPosition(p);
            initPositionOfPartialCrystals.push(p);

            let s = new THREE.Vector3();
            s.x = partialCrystal.scale.x;
            s.y = partialCrystal.scale.y;
            s.z = partialCrystal.scale.z;
            initScaleOfPartialCrystals.push(s);

            //Rotate World Space
            let partialCrystalRootAngleSpeed = new THREE.Vector3(getRandomScale(- 2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI));
            partialCrystalRootAngleSpeeds.push(partialCrystalRootAngleSpeed);

            //Rotate Local Space
            let partialCrystalAngleSpeed = new THREE.Vector3(getRandomScale(- 2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI));
            partialCrystalAngleSpeeds.push(partialCrystalAngleSpeed);
        });
    }



    onWindowResize();

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Event
    /////////////////////////////////////////////////////////////////////////////////////////////
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);
    window.addEventListener('resize', onWindowResize, false);
    /////////////////////////////////////////////////////////////////////////////////////////////

}

function onDocumentMouseDown(event) {
    isMouseDown = true;
    targetRotationX = cameraRoot.rotation.y;
    event.preventDefault();
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationXOnMouseDown = targetRotationX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationYOnMouseDown = targetRotationY;

    oldDownPosX = event.clientX;
    oldDownPosY = event.clientY;
}
function onDocumentMouseUp() {
    isMouseDown = false;
}
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
    //Animation for mouse hover

    if (crystalParent) {

        if (isMouseDown) {
            let y = (event.clientX - oldDownPosX) * 0.1;
            oldDownPosX = event.clientX;

            TweenMax.killTweensOf(crystalParent);
            TweenMax.to(crystalParent.rotation, 3, {
                ease: Expo.easeOut,
                y: crystalParent.rotation.y + y,
                onUpdate: function (t) {

                }
            })
        }
        else {
            //Hover
            let x = 0;
            let y = 0;
            if ((mouseX * 1 / windowHalfX) >= 0) {
                x = (-mouseY / windowHalfY + 1) * 0.2;
                y = (-mouseX / windowHalfX + 1) * 0.2;
            }
            else {
                x = (2 + (-mouseY / windowHalfY) - 1) * 0.2;
                y = (2 + (-mouseX / windowHalfX) - 1) * 0.2;
            }

            TweenMax.killTweensOf(cameraRoot);
            TweenMax.to(cameraRoot.rotation, 2, {
                ease: Expo.easeOut,
                x: x,
                y: y,
                onUpdate: function (t) {

                }
            })

        }

    }

}
function onDocumentTouchStart(event) {
    isMouseDown = true;
    targetRotationX = cameraRoot.rotation.y;
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationXOnMouseDown = targetRotationX;
        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationYOnMouseDown = targetRotationY;

        oldDownPosX = event.touches[0].pageX;
        oldDownPosY = event.touches[0].pageY;
    }
}
function onDocumentTouchEnd(event) {
    isMouseDown = false;
}
function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
        mouseY = event.touches[0].pageY - windowHalfY;
        targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
        //Animation for mouse hover

        if (crystalParent) {

            if (isMouseDown) {
                let y = (event.touches[0].pageX - oldDownPosX) * 0.1;
                oldDownPosX = event.touches[0].pageX;

                TweenMax.killTweensOf(crystalParent);
                TweenMax.to(crystalParent.rotation, 3, {
                    ease: Expo.easeOut,
                    y: crystalParent.rotation.y + y,
                    onUpdate: function (t) {

                    }
                })
            }
            else {
                //Hover
                let x = 0;
                let y = 0;
                if ((mouseX * 1 / windowHalfX) >= 0) {
                    x = (-mouseY / windowHalfY + 1) * 0.2;
                    y = (-mouseX / windowHalfX + 1) * 0.2;
                }
                else {
                    x = (2 + (-mouseY / windowHalfY) - 1) * 0.2;
                    y = (2 + (-mouseX / windowHalfX) - 1) * 0.2;
                }

                TweenMax.killTweensOf(cameraRoot);
                TweenMax.to(cameraRoot.rotation, 2, {
                    ease: Expo.easeOut,
                    x: x,
                    y: y,
                    onUpdate: function (t) {

                    }
                })

            }

        }
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // composer.reset();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function partialCrystalUpdate(time, texture, pos) {
    for (let i = 0; i < partialCrystalCount; i++) {
        if (partialCrystals[i]) {
            partialCrystals[i].traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    let isMarker = child.name.includes("photo");
                    if (!isMarker) {
                        child.material.uniforms.time.value = time;
                        child.material.uniforms.envMap.value = texture;
                        child.material.uniforms.lightPosition.value = pos;
                        child.material.uniforms.matrixWorldInverse.value = partialCrystals[i].matrixWorld.getInverse(partialCrystals[i].matrixWorld)
                        child.material.uniforms["animationParam1"].value = 1;
                        child.material.uniforms["animationParam2"].value = 1;
                        child.material.uniforms.lightValueParam.value = 0.1;
                        child.material.uniforms.radius = distanceVector(partialCrystals[i].position, new THREE.Vector3(0, 0, 0));
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }
}

function logoCrystalUpdate(time, texture, pos) {
    if (logoCrystal) {
        logoCrystal.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.uniforms.time.value = time;
                child.material.uniforms.envMap.value = texture;
                child.material.uniforms.lightPosition.value = pos;
                child.material.uniforms.matrixWorldInverse.value = logoCrystal.matrixWorld.getInverse(logoCrystal.matrixWorld)
                child.material.uniforms["animationParam1"].value = 1;
                child.material.uniforms["animationParam2"].value = 0;
                child.material.uniforms.lightValueParam.value = 0.1;
                child.material.needsUpdate = true;
            }
        });
    }
}

function render() {
    if (!loaded)
        return;

    envSphere.visible = true;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Shader
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    envSphere.rotation.y += Math.PI / 180 / 10;
    if (useShader) {
        let time = (new Date).getTime() - startTime;
        let t = time / 180 * Math.PI / 20;
        lightPosition.x = 180 * Math.cos(t);
        lightPosition.z = 180 * Math.sin(t);

        partialCrystalUpdate(t, cubeCamera1.renderTarget.texture, lightPosition);
        logoCrystalUpdate(t, cubeCamera1.renderTarget.texture, lightPosition);
        cubeCamera2.update(renderer, scene);
        cubeCamera2.renderTarget.texture.needsUpdate = true;
        partialCrystalUpdate(t, cubeCamera2.renderTarget.texture, lightPosition);
        logoCrystalUpdate(t, cubeCamera2.renderTarget.texture, lightPosition);
        cubeCamera1.update(renderer, scene);
        cubeCamera1.renderTarget.texture.needsUpdate = true;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Animation
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var delta = 5 * clock.getDelta();

    //Logo Crystal Animation
    if (logoCrystal && currentState == State.End) {
        logoCrystal.rotation.y += 0.05 * delta;
    }

    //Partial Crystal Animation
    for (let i = 0; i < partialCrystalCount; i++) {
        //Rotate local space
        if (partialCrystals[i]) {
            partialCrystals[i].rotation.x += partialCrystalAngleSpeeds[i].x / 240;
            partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].y / 240;
            partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].z / 240;
        }

        //Rotate world space
        if (partialCrystalRoots[i]) {
            if (currentState == State.Laround) {
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x / 2200;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y / 2200;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z / 2200;
            }
            if (currentState == State.Lgather || currentState == State.Saround || currentState == State.Sgather || currentState == State.Logo) {
                accelTimerForRootAngle += isMobile ? 0.000011 : 0.0000011;
                let a = 0.001 - accelTimerForRootAngle;
                a = a > 0 ? 0 : Math.abs(a);
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x / 2200 + a;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y / 2200 + a;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z / 2200 + a;
            }
        }
    }

    switch (currentState) {
        case State.Laround:
            //Animation by mouse
            if (isMouseDown) {
                downTimer += delta;
                if (downTimer > State.times[currentState].value) {
                    currentState = State.Lgather;
                    //Anim Lgather
                    let idx = 0;
                    partialCrystals.forEach(partCrystal => {
                        //Random point within sphere uniformly
                        let rx = initPositionOfPartialCrystals[idx].x * 0.25;
                        let ry = initPositionOfPartialCrystals[idx].y * 0.25;
                        let rz = initPositionOfPartialCrystals[idx].z * 0.25;
                        let sx = initScaleOfPartialCrystals[idx].x * 0.4;
                        let sy = initScaleOfPartialCrystals[idx].y * 0.4;
                        let sz = initScaleOfPartialCrystals[idx].z * 0.4;
                        TweenMax.killTweensOf(partCrystal);
                        TweenMax.to(partCrystal.position, 2, {
                            ease: Sine.easeInOut,
                            x: rx,
                            y: ry,
                            z: rz,
                            onComplete() {
                                // currentState = State.Saround;
                            },
                            onUpdate() {

                            }
                        });
                        TweenMax.to(partCrystal.scale, 2, {
                            ease: Sine.easeInOut,
                            x: sx,
                            y: sy,
                            z: sz,
                            onComplete() {
                                // currentState = State.Saround;
                            },
                            onUpdate() {

                            }
                        });
                        //Change Material
                        if (!useShader) {
                            partCrystal.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    let isMarker = child.name.includes("photo");
                                    if (!isMarker) {
                                        TweenMax.to(child.material, 1.5, {
                                            ease: Power1.easeIn,
                                            envMapIntensity: 5,
                                        });
                                    }
                                }
                            });
                        }
                        idx++;
                    });
                }

            }
            else {
                downTimer -= delta;
                if (downTimer < 0)
                    downTimer = 0;
            }
            break;

        case State.Lgather:
            if (isMouseDown) {
                downTimer += delta;
                if (downTimer > State.times[currentState].value) {
                    currentState = State.Saround;
                    downTimer = 0;
                }
            }
            else {
                //Return origin position
                currentState = State.Laround;
                downTimer = 0;
                accelTimerForRootAngle = 0;
                let idx = 0;
                partialCrystals.forEach(partCrystal => {
                    TweenMax.killTweensOf(partCrystal);
                    TweenMax.to(partCrystal.position, 1.9, {
                        x: initPositionOfPartialCrystals[idx].x,
                        y: initPositionOfPartialCrystals[idx].y,
                        z: initPositionOfPartialCrystals[idx].z,
                        ease: Expo.easeOut
                    });
                    TweenMax.to(partCrystal.scale, 2, {
                        ease: Sine.easeInOut,
                        x: initScaleOfPartialCrystals[idx].x,
                        y: initScaleOfPartialCrystals[idx].y,
                        z: initScaleOfPartialCrystals[idx].z,
                        onComplete() {
                            // currentState = State.Saround;
                        },
                        onUpdate() {

                        }
                    });
                    //Change Material
                    if (!useShader) {
                        partCrystal.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                let isMarker = child.name.includes("photo");
                                if (!isMarker) {
                                    TweenMax.to(child.material, 0.5, {
                                        ease: Power1.easeIn,
                                        envMapIntensity: 1,
                                    });
                                }
                            }
                        });
                    }
                    idx++;
                });
            }
            break;
        case State.Saround:
            downTimer += delta;
            if (downTimer > State.times[currentState].value) {
                currentState = State.Sgather;
                downTimer = 0;
            }
            break;
        case State.Sgather:
            downTimer += delta;
            if (downTimer > State.times[currentState].value) {
                currentState = State.Logo;
                downTimer = 0;
                //Anim Sgather
                partialCrystals.forEach(partCrystal => {
                    //Gathering Crystal to Zero point
                    TweenMax.killTweensOf(partCrystal);
                    TweenMax.to(partCrystal.position, 1.0, {
                        ease: Power1.easeOut,
                        x: 0,
                        y: 0,
                        z: 0,
                        onComplete() {

                        },
                        onUpdate() {
                        }
                    });
                    //Change Material
                    if (!useShader) {
                        partCrystal.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                let isMarker = child.name.includes("photo");
                                if (!isMarker) {
                                    TweenMax.to(child.material, 0.5, {
                                        ease: Power1.easeIn,
                                        envMapIntensity: 1000,
                                    });
                                }
                            }
                        });
                    }


                });
            }
            //Hide holder
            holderContainer.classList.add("hidden");
            break;
        case State.Logo:
            //Hide partialCrystals
            downTimer += delta;
            if (downTimer > State.times[currentState].value) {
                //Logo
                currentState = State.End;
                downTimer = 0;

                logoCrystal.visible = true;
                logoCrystal.rotation.set(0, 0, 0);
                crystalParent.rotation.set(0, -Math.PI * 3.3 / 5, 0);


                TweenMax.killTweensOf(logoCrystal);
                TweenMax.to(logoCrystal.scale, 3.9, {
                    ease: Power1.easeOut,
                    x: 0.9,
                    y: 0.9,
                    z: 0.9,
                    onComplete() {
                        // currentState = State.Saround;

                    },
                    onUpdate() {

                    }
                });
                //Return Crystal Material
                if (!useShader) {
                    TweenMax.to(logoCrystal.children[0].material, 0.7, {
                        ease: Power3.easeOut,
                        envMapIntensity: 3.3,
                    });
                }


            }
            break;
        case State.End:
            downTimer = 0;
            accelTimerForRootAngle = 0;
            partialCrystals.forEach(partCrystal => {
                partCrystal.visible = false;
            })
            break;
        default:
            break;
    }

    envSphere.visible = false;
    renderer.render(scene, camera);
    // composer.render(0.01);
}
