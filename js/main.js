var container;
var camera, cubeCamera1, cubeCamera2, cameraRoot, scene, renderer, composer, clock;
var sCrystalMaterial;
var sCrystalMaterial1;
var sCrystalMaterial2;
var sCrystalMaterial3;
var sCrystalMaterial4;

var lCrystalMaterial;
var logoCrystal;

var originPartialCrystals = [];
var partialCrystals = [];
var partialCrystalRoots = [];
var partialCrystalAngleSpeeds = [];
var partialCrystalRootAngleSpeeds = [];
var initPositionOfPartialCrystals = [];
var initScaleOfPartialCrystals = [];
var partialCrystalParent;
var partialCrystalCount = 150;

var partial2Crystals = [];
var partial2CrystalRoots = [];
var partial2CrystalAngleSpeeds = [];
var initPositionOfPartial2Crystals = [];
var initScaleOfPartial2Crystals = [];
var partial2CrystalParent;
var partial2CrystalCount = 50;

var crystalParent;

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

var useTsu = false;
//Shader
var useShader = true;
var envMap;

var sCrystalVertexShader;
var sCrystalfragmentShader;
var sCrystalDiffuseMap;
var sCrystalAlphaMap;
var sCrystalSpecularMap;
var sCrystalNormalMap;
var sCrystalBumpMap;
var sCrystalRadius;

var sCrystalDiffuseMap1;
var sCrystalAlphaMap1;
var sCrystalSpecularMap1;
var sCrystalNormalMap1;
var sCrystalBumpMap1;

var sCrystalDiffuseMap2;
var sCrystalAlphaMap2;
var sCrystalSpecularMap2;
var sCrystalNormalMap2;
var sCrystalBumpMap2;

var sCrystalDiffuseMap3;
var sCrystalAlphaMap3;
var sCrystalSpecularMap3;
var sCrystalNormalMap3;
var sCrystalBumpMap3;

var sCrystalDiffuseMap4;
var sCrystalAlphaMap4;
var sCrystalSpecularMap4;
var sCrystalNormalMap4;
var sCrystalBumpMap4;


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
    LogoAround: 7,
    times: {
        1: { value: 4 },
        2: { value: 15.0 },
        3: { value: 6.6 },
        4: { value: 3 },
        5: { value: 4 },
        6: { value: 0 },
        7: { value: 3 },
    }
};

var currentState = State.Laround;

// Effect
var expShader, ringShader;
var expTextures, ringTextures;
var expMesh, ringMesh;
var startEffect = false;
var expTimer = 0;
var ringTimer = 0;

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
        camera.position.y = 0;
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
            ambientLight.intensity = 50;
            scene.add(ambientLight);
            directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 30, -1);
            directionalLight.intensity = 5;
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

        let originIdxs = [];
        //clone partial crystal
        for (let i = 0; i < partialCrystalCount; i++) {
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

            let originIdx = Math.floor(getRandomScale(0, originPartialCrystals.length));
            originIdxs.push(originIdx);
            let partialCrystal = originPartialCrystals[originIdx].clone();
            partialCrystal.visible = true;

            partialCrystal.position.set(rx, ry, rz);
            let partialCrystalSize = useTsu ? 2.5 : 3.5;
            partialCrystal.scale.set(partialCrystalSize, partialCrystalSize, partialCrystalSize);

            partialCrystal.rotation.set(getRandomScale(-40, 40), getRandomScale(-40, 40), getRandomScale(-40, 40));

            partialCrystals.push(partialCrystal);

            let partialCrystalRoot = new THREE.Object3D();
            scene.add(partialCrystalRoot);
            partialCrystalRoot.add(partialCrystal);
            partialCrystalRoot.position.set(0, 0, 0);
            partialCrystalRoot.rotation.set(0, beta, 0);
            partialCrystalRoots.push(partialCrystalRoot);

            partialCrystalParent = new THREE.Object3D();
            partialCrystalParent.add(partialCrystalRoot);
            crystalParent.add(partialCrystalParent);
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
        }

        for (let i = 0; i < partialCrystalCount; i++) {
            let alphaMap = null;
            let bumpMap = null;
            let normalMap = null;
            let specularMap = null;
            let mat = null;
            if (useTsu) {
                alphaMap = sCrystalAlphaMap;
                bumpMap = sCrystalBumpMap;
                normalMap = sCrystalNormalMap;
                specularMap = sCrystalSpecularMap;
                mat = sCrystalMaterial;
            }
            else {
                if (originIdxs[i]>=0 && originIdxs[i] < 2) {
                    alphaMap = sCrystalAlphaMap1;
                    bumpMap = sCrystalBumpMap1;
                    normalMap = sCrystalNormalMap1;
                    specularMap = sCrystalSpecularMap1;
                    mat = sCrystalMaterial1;
                }
                if (originIdxs[i]>=2 && originIdxs[i] < 4) {
                    alphaMap = sCrystalAlphaMap2;
                    bumpMap = sCrystalBumpMap2;
                    normalMap = sCrystalNormalMap2;
                    specularMap = sCrystalSpecularMap2;
                    mat = sCrystalMaterial2;
                }
                if (originIdxs[i]>=4 && originIdxs[i] < 6) {
                    alphaMap = sCrystalAlphaMap3;
                    bumpMap = sCrystalBumpMap3;
                    normalMap = sCrystalNormalMap3;
                    specularMap = sCrystalSpecularMap3;
                    mat = sCrystalMaterial3;
                }
                if(originIdxs[i]>=6){
                    alphaMap = sCrystalAlphaMap4;
                    bumpMap = sCrystalBumpMap4;
                    normalMap = sCrystalNormalMap4;
                    specularMap = sCrystalSpecularMap4;
                    mat = sCrystalMaterial4;
                }
            }
            partialCrystals[i].traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    if (useShader) {
                        let sCrystalShader = new THREE.RawShaderMaterial({
                            vertexShader: sCrystalVertexShader,
                            fragmentShader: sCrystalfragmentShader,
                            transparent: true,
                            uniforms: {
                                alphaMap: {
                                    type: "t",
                                    value: alphaMap
                                },
                                bumpMap: {
                                    type: "t",
                                    value: bumpMap
                                },
                                envMap: {
                                    type: "t",
                                    value: envMap
                                },
                                envMapIntensity: {
                                    type: "1f",
                                    value: 0.1
                                },
                                normalMap: {
                                    type: "t",
                                    value: normalMap
                                },
                                specularMap: {
                                    type: "t",
                                    value: specularMap
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
                                    value: 180
                                },
                                radiusRatio: {
                                    type: "1f",
                                    value: 1
                                },
                                rotationSpeed: {
                                    type: "1f",
                                    value: .0001
                                },
                                alphaValue: {
                                    type: "1f",
                                    value: .1
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
                        child.material = sCrystalShader;
                    }
                    else
                        child.material = mat;
                }
            });
        }

        originIdxs = [];
        //clone partial2 crystal
        for (let i = 0; i < partial2CrystalCount; i++) {
            //Random point within sphere uniformly
            let symbolX = getRandomScale(-1, 1);
            symbolX = symbolX >= 0 ? 1 : -1;
            let symbolY = getRandomScale(-1, 1);
            symbolY = symbolY >= 0 ? 1 : -1;

            let alpha = 2 * Math.PI * getRandom();

            let ua = getRandomScale(40, 80);

            let rx = symbolX * ua * Math.cos(alpha);
            let rz = symbolY * ua * Math.sin(alpha);
            let ry = getRandomScale(-30, 30);

            let originIdx = Math.floor(getRandomScale(0, originPartialCrystals.length));
            originIdxs.push(originIdx);
            let partial2Crystal = originPartialCrystals[originIdx].clone();
            partial2Crystal.visible = false;

            partial2Crystal.position.set(rx, ry, rz);
            let partial2CrystalSize = useTsu ? 8 : 10;
            partial2Crystal.scale.set(partial2CrystalSize, partial2CrystalSize, partial2CrystalSize);

            partial2Crystal.rotation.set(getRandomScale(-40, 40), getRandomScale(-40, 40), getRandomScale(-40, 40));

            partial2Crystals.push(partial2Crystal);

            let partial2CrystalRoot = new THREE.Object3D();
            scene.add(partial2CrystalRoot);
            partial2CrystalRoot.add(partial2Crystal);
            partial2CrystalRoot.position.set(0, 0, 0);
            partial2CrystalRoots.push(partial2CrystalRoot);

            partial2CrystalParent = new THREE.Object3D();
            partial2CrystalParent.add(partial2CrystalRoot);
            logoCrystal.add(partial2CrystalParent);

            partial2CrystalRoot.updateMatrixWorld();
            let p = new THREE.Vector3();
            partial2Crystal.getWorldPosition(p);
            initPositionOfPartial2Crystals.push(p);

            let s = new THREE.Vector3();
            s.x = partial2Crystal.scale.x;
            s.y = partial2Crystal.scale.y;
            s.z = partial2Crystal.scale.z;
            initScaleOfPartial2Crystals.push(s);

            partial2Crystal.position.set(0, 0, 0);
            partial2Crystal.scale.set(0, 0, 0);

            //Rotate Local Space
            let partial2CrystalAngleSpeed = new THREE.Vector3(getRandomScale(- 2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI));
            partial2CrystalAngleSpeeds.push(partial2CrystalAngleSpeed);
        }

        console.log(originIdxs)
        for (let i = 0; i < partial2CrystalCount; i++) {
            let alphaMap = null;
            let bumpMap = null;
            let normalMap = null;
            let specularMap = null;
            let mat = null;
            if (useTsu) {
                alphaMap = sCrystalAlphaMap;
                bumpMap = sCrystalBumpMap;
                normalMap = sCrystalNormalMap;
                specularMap = sCrystalSpecularMap;
                mat = sCrystalMaterial;
            }
            else {
                if (originIdxs[i]>=0 && originIdxs[i] < 2) {
                    alphaMap = sCrystalAlphaMap1;
                    bumpMap = sCrystalBumpMap1;
                    normalMap = sCrystalNormalMap1;
                    specularMap = sCrystalSpecularMap1;
                    mat = sCrystalMaterial1;
                }
                if (originIdxs[i]>=2 && originIdxs[i] < 4) {
                    alphaMap = sCrystalAlphaMap2;
                    bumpMap = sCrystalBumpMap2;
                    normalMap = sCrystalNormalMap2;
                    specularMap = sCrystalSpecularMap2;
                    mat = sCrystalMaterial2;
                }
                if (originIdxs[i]>=4 && originIdxs[i] < 6) {
                    alphaMap = sCrystalAlphaMap3;
                    bumpMap = sCrystalBumpMap3;
                    normalMap = sCrystalNormalMap3;
                    specularMap = sCrystalSpecularMap3;
                    mat = sCrystalMaterial3;
                }
                if(originIdxs[i]>=6){
                    alphaMap = sCrystalAlphaMap4;
                    bumpMap = sCrystalBumpMap4;
                    normalMap = sCrystalNormalMap4;
                    specularMap = sCrystalSpecularMap4;
                    mat = sCrystalMaterial4;
                }
            }

            partial2Crystals[i].traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    if (useShader) {
                        let sCrystalShader = new THREE.RawShaderMaterial({
                            vertexShader: sCrystalVertexShader,
                            fragmentShader: sCrystalfragmentShader,
                            transparent: true,
                            uniforms: {
                                alphaMap: {
                                    type: "t",
                                    value: alphaMap
                                },
                                bumpMap: {
                                    type: "t",
                                    value: bumpMap
                                },
                                envMap: {
                                    type: "t",
                                    value: envMap
                                },
                                envMapIntensity: {
                                    type: "1f",
                                    value: 0.5
                                },
                                normalMap: {
                                    type: "t",
                                    value: normalMap
                                },
                                specularMap: {
                                    type: "t",
                                    value: specularMap
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
                                    value: 20
                                },
                                radiusRatio: {
                                    type: "1f",
                                    value: 1
                                },
                                rotationSpeed: {
                                    type: "1f",
                                    value: .1
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
                        child.material = sCrystalShader;
                    }
                    else
                        child.material = mat;

                }
            });
        }


        let lCrystalShaderMat = new THREE.RawShaderMaterial({
            vertexShader: lCrystalVertexShader,
            fragmentShader: lCrystalfragmentShader,
            transparent: true,
            uniforms: {
                map: {
                    type: "t",
                    value: lCrystalDiffuseMap
                },
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
                envMapIntensity: {
                    type: "1f",
                    value: 0.5
                },
                normalMap: {
                    type: "t",
                    value: lCrystalNormalMap
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
                    value: 3
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

        //Effect Mesh
        let expGeo = new THREE.RingGeometry(1, 12, 30);
        let expBGeo = new THREE.BufferGeometry();
        expBGeo.fromGeometry(expGeo);
        var expMaterial = new THREE.MeshBasicMaterial({ map: null, side: THREE.DoubleSide, transparent: true });
        expMesh = new THREE.Mesh(expBGeo, expMaterial);
        expMesh.position.set(0, 0, 120);
        expMesh.visible = false;
        cameraRoot.add(expMesh);

        let ringGeo = new THREE.RingGeometry(1, 15, 30);
        let ringBGeo = new THREE.BufferGeometry();
        ringBGeo.fromGeometry(ringGeo);
        var ringMaterial = new THREE.MeshBasicMaterial({ map: null, side: THREE.DoubleSide, transparent: true });
        ringMesh = new THREE.Mesh(ringBGeo, ringMaterial);
        ringMesh.position.set(0, 0, 80);
        ringMesh.visible = false;
        cameraRoot.add(ringMesh);

    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        loadingPercent.textContent = Math.floor(itemsLoaded * 100 / itemsTotal);

    };

    manager.onError = function (url) {

        // console.log('There was an error loading ' + url);

    };

    var textureLoader = new THREE.TextureLoader(manager);

    var effectPath = "Assets/effect/";
    expTextures = [];
    for (let i = 0; i < 61; i++) {
        let txt = textureLoader.load(effectPath + "exp/" + "img" + ((i < 10) ? "0" + i : i) + ".png");
        expTextures.push(txt);
    }
    ringTextures = [];
    for (let i = 0; i < 76; i++) {
        let txt = textureLoader.load(effectPath + "ring/" + "img" + ((i < 10) ? "0" + i : i) + ".png");
        ringTextures.push(txt);
    }

    var texturePath = useTsu ? "Assets/texture/tsu/" : "Assets/texture/";
    envMap = textureLoader.load(texturePath + "env.jpg");
    sCrystalDiffuseMap = textureLoader.load(texturePath + "diffuse.jpg");
    sCrystalAlphaMap = textureLoader.load(texturePath + "alpha.jpg");
    sCrystalSpecularMap = textureLoader.load(texturePath + "specular.jpg");
    sCrystalNormalMap = textureLoader.load(texturePath + "normal.jpg");
    sCrystalBumpMap = textureLoader.load(texturePath + "bump.jpg");

    if (!useTsu) {
        sCrystalDiffuseMap1 = textureLoader.load(texturePath + "1/diffuse.jpg");
        sCrystalAlphaMap1 = textureLoader.load(texturePath + "1/alpha.jpg");
        sCrystalSpecularMap1 = textureLoader.load(texturePath + "1/specular.jpg");
        sCrystalNormalMap1 = textureLoader.load(texturePath + "1/normal.jpg");
        sCrystalBumpMap1 = textureLoader.load(texturePath + "1/bump.jpg");

        sCrystalDiffuseMap2 = textureLoader.load(texturePath + "2/diffuse.jpg");
        sCrystalAlphaMap2 = textureLoader.load(texturePath + "2/alpha.jpg");
        sCrystalSpecularMap2 = textureLoader.load(texturePath + "2/specular.jpg");
        sCrystalNormalMap2 = textureLoader.load(texturePath + "2/normal.jpg");
        sCrystalBumpMap2 = textureLoader.load(texturePath + "2/bump.jpg");

        sCrystalDiffuseMap3 = textureLoader.load(texturePath + "3/diffuse.jpg");
        sCrystalAlphaMap3 = textureLoader.load(texturePath + "3/alpha.jpg");
        sCrystalSpecularMap3 = textureLoader.load(texturePath + "3/specular.jpg");
        sCrystalNormalMap3 = textureLoader.load(texturePath + "3/normal.jpg");
        sCrystalBumpMap3 = textureLoader.load(texturePath + "3/bump.jpg");

        sCrystalDiffuseMap4 = textureLoader.load(texturePath + "4/diffuse.jpg");
        sCrystalAlphaMap4 = textureLoader.load(texturePath + "4/alpha.jpg");
        sCrystalSpecularMap4 = textureLoader.load(texturePath + "4/specular.jpg");
        sCrystalNormalMap4 = textureLoader.load(texturePath + "4/normal.jpg");
        sCrystalBumpMap4 = textureLoader.load(texturePath + "4/bump.jpg");
    }

    lCrystalDiffuseMap = textureLoader.load(texturePath + "logo/diffuse.jpg");
    lCrystalAlphaMap = textureLoader.load(texturePath + "logo/alpha.jpg");
    lCrystalSpecularMap = textureLoader.load(texturePath + "logo/specular.jpg");
    lCrystalNormalMap = textureLoader.load(texturePath + "logo/normal.jpg");
    lCrystalBumpMap = textureLoader.load(texturePath + "logo/bump.jpg");

    envSphere = new THREE.Mesh(
        new THREE.SphereGeometry(200, 32, 16),
        new THREE.MeshBasicMaterial({
            map: textureLoader.load(texturePath + "env.jpg"),
            side: THREE.DoubleSide,
        })
    );
    envSphere.scale.x *= -1;
    scene.add(envSphere)
    envSphere.visible = false;

    if (!useShader) {
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
            envMapIntensity: useTsu ? 1 : 5.3,
            envMaps: envMap,
            premultipliedAlpha: true,
            map: sCrystalDiffuseMap,
            alphaMap: sCrystalAlphaMap,
            specularMap: sCrystalSpecularMap,
            normalMap: sCrystalNormalMap,
            bumpMap: sCrystalBumpMap,
            normalScale: new THREE.Vector2(1.7, 1.7),
        });

        if (!useTsu) {
            sCrystalMaterial1 = new THREE.MeshPhysicalMaterial({
                // color: 0x0000ff,
                // emissive: 0xffffff,
                roughness: 0.001,
                metalness: 0.9,
                reflectivity: 0.5,
                opacity: 1,
                side: THREE.DoubleSide,
                transparent: true,
                mapping: THREE.CubeRefractionMapping,
                envMapIntensity: useTsu ? 1 : 5.3,
                envMaps: envMap,
                premultipliedAlpha: true,
                map: sCrystalDiffuseMap1,
                alphaMap: sCrystalAlphaMap1,
                specularMap: sCrystalSpecularMap1,
                normalMap: sCrystalNormalMap1,
                bumpMap: sCrystalBumpMap1,
                normalScale: new THREE.Vector2(1.7, 1.7),
            });

            sCrystalMaterial2 = new THREE.MeshPhysicalMaterial({
                // color: 0x0000ff,
                // emissive: 0xffffff,
                roughness: 0.001,
                metalness: 0.9,
                reflectivity: 0.5,
                opacity: 1,
                side: THREE.DoubleSide,
                transparent: true,
                mapping: THREE.CubeRefractionMapping,
                envMapIntensity: useTsu ? 1 : 5.3,
                envMaps: envMap,
                premultipliedAlpha: true,
                map: sCrystalDiffuseMap2,
                alphaMap: sCrystalAlphaMap2,
                specularMap: sCrystalSpecularMap2,
                normalMap: sCrystalNormalMap2,
                bumpMap: sCrystalBumpMap2,
                normalScale: new THREE.Vector2(1.7, 1.7),
            });

            sCrystalMaterial3 = new THREE.MeshPhysicalMaterial({
                // color: 0x0000ff,
                // emissive: 0xffffff,
                roughness: 0.001,
                metalness: 0.9,
                reflectivity: 0.5,
                opacity: 1,
                side: THREE.DoubleSide,
                transparent: true,
                mapping: THREE.CubeRefractionMapping,
                envMapIntensity: useTsu ? 1 : 5.3,
                envMaps: envMap,
                premultipliedAlpha: true,
                map: sCrystalDiffuseMap3,
                alphaMap: sCrystalAlphaMap3,
                specularMap: sCrystalSpecularMap3,
                normalMap: sCrystalNormalMap3,
                bumpMap: sCrystalBumpMap3,
                normalScale: new THREE.Vector2(1.7, 1.7),
            });

            sCrystalMaterial4 = new THREE.MeshPhysicalMaterial({
                // color: 0x0000ff,
                // emissive: 0xffffff,
                roughness: 0.001,
                metalness: 0.9,
                reflectivity: 0.5,
                opacity: 1,
                side: THREE.DoubleSide,
                transparent: true,
                mapping: THREE.CubeRefractionMapping,
                envMapIntensity: useTsu ? 1 : 5.3,
                envMaps: envMap,
                premultipliedAlpha: true,
                map: sCrystalDiffuseMap4,
                alphaMap: sCrystalAlphaMap4,
                specularMap: sCrystalSpecularMap4,
                normalMap: sCrystalNormalMap4,
                bumpMap: sCrystalBumpMap4,
                normalScale: new THREE.Vector2(1.7, 1.7),
            });
        }


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
            envMapIntensity: 4.3,
            envMaps: envMap,
            premultipliedAlpha: true,
            map: lCrystalDiffuseMap,
            alphaMap: lCrystalAlphaMap,
            specularMap: lCrystalSpecularMap,
            normalMap: lCrystalNormalMap,
            bumpMap: lCrystalBumpMap,
            normalScale: new THREE.Vector2(1.7, 1.7),
        });
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
            if(!useTsu){
                sCrystalMaterial1.envMap = hdrCubeRenderTarget.texture;
                sCrystalMaterial1.needsUpdate = true;
                sCrystalMaterial2.envMap = hdrCubeRenderTarget.texture;
                sCrystalMaterial2.needsUpdate = true;
                sCrystalMaterial3.envMap = hdrCubeRenderTarget.texture;
                sCrystalMaterial3.needsUpdate = true;
                sCrystalMaterial4.envMap = hdrCubeRenderTarget.texture;
                sCrystalMaterial4.needsUpdate = true;
            }
            lCrystalMaterial.envMap = hdrCubeRenderTarget.texture;
            lCrystalMaterial.needsUpdate = true;
            hdrCubeMap.dispose();
            pmremGenerator.dispose();
            pmremCubeUVPacker.dispose();
        });
    }

    //Logo Model
    var modelPath = useTsu ? "Assets/model/tsu/" : "Assets/model/";
    new THREE.OBJLoader(manager).setPath(modelPath).load('logo.obj', function (object) {
        logoCrystal = object;
        crystalParent.add(logoCrystal);
        logoCrystal.visible = false;
    });

    //Partial Model
    crystalParent = new THREE.Object3D()
    for (let i = 1; i < 12; i++) {
        new THREE.OBJLoader(manager).setPath(modelPath).load(i + '.obj', function (object) {
            let originPartialCrystal = object;
            originPartialCrystal.visible = false;
            scene.add(originPartialCrystal);
            originPartialCrystals.push(originPartialCrystal);
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
    mouseY = event.clientY// - windowHalfY;
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
        mouseY = event.touches[0].pageY// - windowHalfY;
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
                        child.material.uniforms.time.value = 0.5;
                        child.material.uniforms.envMap.value = texture;
                        child.material.uniforms.alphaValue.value = 1;
                        child.material.uniforms.envMapIntensity.value = 0.02;
                        child.material.uniforms.lightPosition.value = new THREE.Vector3(0, 1, 0);
                        child.material.uniforms.matrixWorldInverse.value = partialCrystals[i].matrixWorld.getInverse(partialCrystals[i].matrixWorld)
                        child.material.uniforms["animationParam1"].value = 1;
                        child.material.uniforms["animationParam2"].value = 1;
                        child.material.uniforms.lightValueParam.value = 0.01;
                        // child.material.uniforms.radius = distanceVector(partialCrystals[i].position, new THREE.Vector3(0, 0, 0));
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
                child.material.uniforms.time.value = 0.5;
                child.material.uniforms.envMap.value = texture;
                child.material.uniforms.alphaValue.value = 0.9;
                child.material.uniforms.envMapIntensity.value = 0.02;
                child.material.uniforms.lightPosition.value = pos;
                child.material.uniforms.matrixWorldInverse.value = logoCrystal.matrixWorld.getInverse(logoCrystal.matrixWorld)
                child.material.uniforms["animationParam1"].value = 0.9;
                child.material.uniforms["animationParam2"].value = 1;
                child.material.uniforms.lightValueParam.value = 0.01;
                child.material.needsUpdate = true;
            }
        });
    }
}

function expUpdate(texture) {
    if (expMesh) {
        expMesh.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    }
}

function ringUpdate(texture) {
    if (ringMesh) {
        ringMesh.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
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
    let time = (new Date).getTime() - startTime;
    let t = time / 180 * Math.PI / 20;

    if (useShader) {
        lightPosition.x = 150 * Math.cos(t);
        lightPosition.z = 150 * Math.sin(t);

        partialCrystalUpdate(time, cubeCamera1.renderTarget.texture, lightPosition);
        logoCrystalUpdate(time, cubeCamera1.renderTarget.texture, lightPosition);
        cubeCamera2.update(renderer, scene);
        cubeCamera2.renderTarget.texture.needsUpdate = true;
        partialCrystalUpdate(time, cubeCamera2.renderTarget.texture, lightPosition);
        logoCrystalUpdate(time, cubeCamera2.renderTarget.texture, lightPosition);
        cubeCamera1.update(renderer, scene);
        cubeCamera1.renderTarget.texture.needsUpdate = true;
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Animation
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var delta = 5 * clock.getDelta();

    //Logo Crystal Animation
    if (currentState == State.End || currentState == State.LogoAround) {
        logoCrystal.rotation.y += 0.04 * delta;
    }

    //Partial2 Crystal Animation
    if (currentState == State.End || currentState == State.LogoAround) {
        for (let i = 0; i < partial2CrystalCount; i++) {
            //Rotate local space
            if (partial2Crystals[i]) {
                partial2Crystals[i].rotation.x += partial2CrystalAngleSpeeds[i].x / 540;
                partial2Crystals[i].rotation.y += partial2CrystalAngleSpeeds[i].y / 540;
                partial2Crystals[i].rotation.y += partial2CrystalAngleSpeeds[i].z / 540;

            }
        }
    }



    //Partial Crystal Animation
    for (let i = 0; i < partialCrystalCount; i++) {
        //Rotate local space
        if (partialCrystals[i]) {
            partialCrystals[i].rotation.x += partialCrystalAngleSpeeds[i].x / 360;
            partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].y / 360;
            partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].z / 360;

        }

        //Rotate world space
        if (partialCrystalRoots[i]) {
            if (currentState == State.Laround) {
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x / 3600;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y / 3600;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z / 3600;
            }
            if (currentState == State.Lgather || currentState == State.Saround || currentState == State.Sgather || currentState == State.Logo) {
                accelTimerForRootAngle += isMobile ? 0.000011 : 0.0000011;
                let a = 0.001 - accelTimerForRootAngle;
                a = a > 0 ? 0 : Math.abs(a);
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x / 3600 + a;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y / 3600 + a;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z / 3600 + a;
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
                        let rx = initPositionOfPartialCrystals[idx].x * 0.23;
                        let ry = initPositionOfPartialCrystals[idx].y * 0.23;
                        let rz = initPositionOfPartialCrystals[idx].z * 0.23;
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
                                            envMapIntensity: 20,
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
                                        envMapIntensity: useTsu ? 1 : 5.3,
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
                startEffect = true;
                expTimer = 0;
                ringTimer = 0;
                expMesh.visible = true;
                ringMesh.visible = true;

                logoCrystal.visible = true;
                logoCrystal.rotation.set(0, 0, 0);
                crystalParent.rotation.set(0, -Math.PI * 3.3 / 5, 0);

                //Control Logo crystal
                TweenMax.killTweensOf(logoCrystal);
                TweenMax.to(logoCrystal.scale, 3.9, {
                    ease: Power1.easeOut,
                    x: 1,
                    y: 1,
                    z: 1,
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
                else {
                    TweenMax.to(logoCrystal.children[0].material.uniforms.animationParam3, 3, {
                        ease: Power1.easeIn,
                        value: 0,
                    });
                }


                let idx = 0;
                partial2Crystals.forEach(part2Crystal => {
                    part2Crystal.visible = true;
                    TweenMax.killTweensOf(part2Crystal);
                    TweenMax.to(part2Crystal.position, 1, {
                        x: initPositionOfPartial2Crystals[idx].x,
                        y: initPositionOfPartial2Crystals[idx].y,
                        z: initPositionOfPartial2Crystals[idx].z,
                        ease: Sine.easeInOut
                    });
                    TweenMax.to(part2Crystal.scale, 2, {
                        ease: Sine.easeInOut,
                        x: initScaleOfPartial2Crystals[idx].x,
                        y: initScaleOfPartial2Crystals[idx].y,
                        z: initScaleOfPartial2Crystals[idx].z,
                        onComplete() {
                            // currentState = State.Saround;
                        },
                        onUpdate() {

                        }
                    });
                    //Change Material
                    if (!useShader) {
                        part2Crystal.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                let isMarker = child.name.includes("photo");
                                if (!isMarker) {
                                    TweenMax.to(child.material, 0.5, {
                                        ease: Power1.easeIn,
                                        envMapIntensity: useTsu ? 1 : 5.3,
                                    });
                                }
                            }
                        });
                    }
                    idx++;
                });

            }
            break;
        case State.End:
            downTimer = 0;
            accelTimerForRootAngle = 0;
            scene.remove(partialCrystalParent);
            for(let i=0; i<partialCrystalCount; i++){
                scene.remove(partialCrystalRoots[i]);
                scene.remove(partialCrystals[i]);
                partialCrystals[i].traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        scene.remove(child);
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                });
            }
            partialCrystals.forEach(partCrystal => {
                partCrystal.visible = false;
            })
            currentState = State.LogoAround;
            break;
        case State.LogoAround:
            break;
        default:
            break;
    }

    if (startEffect) {
        expUpdate(expTextures[Math.floor(expTimer)]);
        ringUpdate(ringTextures[Math.floor(ringTimer)]);
        expTimer += delta * 5;
        ringTimer += delta * 5.5;

        if (expTimer > expTextures.length || ringTimer > ringTextures.length) {
            startEffect = false;
            expMesh.visible = false;
            ringMesh.visible = false;
            // logoCrystal.position.x = 0;
            // logoCrystal.position.y = 0;
            // logoCrystal.position.z = 0;
        }
        //Vibrate
        logoCrystal.position.x += (8 - expTimer / 11) * 0.1 * Math.sin(t * 600.0);
        logoCrystal.position.y += (8 - expTimer / 11) * 0.1 * Math.sin(t * 200.0);
        logoCrystal.position.z += (8 - expTimer / 11) * 0.1 * Math.sin(t * 600.0);
    }


    envSphere.visible = false;
    renderer.render(scene, camera);
    // composer.render(0.01);
}
