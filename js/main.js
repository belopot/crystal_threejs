// var assetPath = "https://office-shimura.jp/wp-content/themes/office-shimura/crystal_threejs/Assets/";
var assetPath = "Assets/";
var container;
var camera, cameraRoot, cubeCamera1, cubeCamera2, scene, renderer, composer, clock;

var sCrystalShader1;
var sCrystalShader2;

var lCrystalShader1;
var lCrystalShader2;

var sCrystalAlphaMap;
var sCrystalSpecularMap;
var sCrystalNormalMap;
var sCrystalBumpMap;

var lCrystalAlphaMap1;
var lCrystalSpecularMap1;
var lCrystalNormalMap1;
var lCrystalBumpMap1;

var lCrystalAlphaMap2;
var lCrystalSpecularMap2;
var lCrystalNormalMap2;
var lCrystalBumpMap2;

var raycaster = new THREE.Raycaster();
var pickMouse = new THREE.Vector2();
var pickLogo = false;

var autoCreate = false;

var logoCrystal;
var logoCrystals = [];
var logoCrystalIdx = 0;

var originPartialCrystals = [];
var partialCrystals = [];
var partialCrystalRoots = [];
var partialCrystalAngleSpeeds = [];
var partialCrystalRootAngleSpeeds = [];
var initPositionOfPartialCrystals = [];
var initScaleOfPartialCrystals = [];
var partialCrystalParent;
var partialCrystalCount = 146;
var partialCrystalSize = 2.8;

var partial2Crystals = [];
var partial2CrystalRoots = [];
var partial2CrystalAngleSpeeds = [];
var initPositionOfPartial2Crystals = [];
var initScaleOfPartial2Crystals = [];
var partial2CrystalParent;
var partial2CrystalCount = 69;
var partial2CrystalSize = 2;

var totalRoot;

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

var envMap;

var sCrystalRadius;

var envSphere;
var lightPosition = new THREE.Vector3(0, 0, 0);
var startTime;
var lightValueParam = {
    value: 9000
};

var brightnessValue = {
    value: 1
}

var vibrateValue = {
    value: 0
}

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
    LogoGather: 8,
    LogoAppear: 9,
    Partial: 10,
    times: {
        1: { value: 4 },
        2: { value: 15.0 },
        3: { value: 5.6 },
        4: { value: 1 },
        5: { value: 3.5 },
        6: { value: 1 },
        7: { value: 3 },
        8: { value: 12 },
        9: { value: 9.7 },
        10: { value: 8 },
    }
};


var currentState = State.Laround;

// Effect
var expShader, shineShader, ringShader;
var expTextures, shineTextures, ringTexture;
var expMesh, shineMesh, ringMesh1, ringMesh2, ringMesh3;
var invRing1, invRing2, invRing3, invRing4, invRing5, invRing6;
var invRingMat;
var ringMat;
var startEffect = false;
var expTimer = 0;
var ringTimer = 0;

var gatherParam = {
    value: 0
}

var alphaTimer = {
    min: 0.1,
    max: 0.5,
    step: 0.0006,
    val: 0.2,
    inc: true
};

//fix 'S' crystal 
var isFixed = true;

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
        // scene.background = new THREE.Color(0x0505ff);
        scene.background = new THREE.Color(0x111f65);

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Renderer
        //////////////////////////////////////////////////////////////////////////////////////////////
        renderer = new THREE.WebGLRenderer({ antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        // renderer.autoClear = false;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Camera
        //////////////////////////////////////////////////////////////////////////////////////////////

        camera = new THREE.PerspectiveCamera(mobileAndTabletcheck() ? 85 : 55, window.innerWidth / window.innerHeight, 0.01, 300);
        camera.position.x = -135;
        camera.position.y = -12;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        cameraRoot = new THREE.Object3D();
        cameraRoot.add(camera);
        scene.add(cameraRoot);

        cubeCamera1 = new THREE.CubeCamera(1, 1000, 512);
        cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        cubeCamera2 = new THREE.CubeCamera(1, 1000, 512);
        cubeCamera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        cubeCamera1.position.set(0, 0, 135);
        cubeCamera2.position.set(0, 0, 135);
        scene.add(cubeCamera1);
        scene.add(cubeCamera2);

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Clock
        //////////////////////////////////////////////////////////////////////////////////////////////
        clock = new THREE.Clock();

        /////////////////////////////////////////////////////////////////////////////////////////////
        //Effects
        /////////////////////////////////////////////////////////////////////////////////////////////
        // var renderModel = new THREE.RenderPass(scene, camera);
        var effectBloom = new THREE.BloomPass(400.4);
        // var effectFilm = new THREE.FilmPass(0.1, 0.1, 2048, false);
        // effectFilm.renderToScreen = true;

        composer = new THREE.EffectComposer(renderer);
        // composer.addPass(renderModel);
        composer.addPass(effectBloom);
        // composer.addPass(effectFilm);

        isMobile = mobileAndTabletcheck()
    };

    manager.onLoad = function () {

        // console.log('Loading complete!');
        loadingContainer.classList.add("loaded");
        loaded = true;

        startTime = (new Date).getTime();

        //clone partial crystal
        partialCrystalParent = new THREE.Object3D();
        totalRoot.add(partialCrystalParent);
        scene.add(totalRoot);
        let partialCrystalIdx = 0;
        for (let i = 0; i < partialCrystalCount; i++) {
            //Random point within sphere uniformly
            let symbolX = getRandomScale(-1, 1);
            symbolX = symbolX >= 0 ? 1 : -1;
            let symbolY = getRandomScale(-1, 1);
            symbolY = symbolY >= 0 ? 1 : -1;

            let alpha = 2 * Math.PI * getRandom();
            let beta = getRandomScale(-2 * Math.PI, 2 * Math.PI);

            let ua = getRandomScale(20, 150);

            let rx = symbolX * ua * Math.cos(alpha);
            let ry = symbolY * ua * Math.sin(alpha);
            let rz = 0;

            let partialCrystal = originPartialCrystals[partialCrystalIdx].clone();
            partialCrystal.material = sCrystalShader1;
            partialCrystalIdx++;
            if (partialCrystalIdx == originPartialCrystals.length) {
                partialCrystalIdx = 0;
            }

            partialCrystal.visible = true;
            partialCrystal.position.set(rx, ry, rz);

            partialCrystal.scale.set(partialCrystalSize, partialCrystalSize, partialCrystalSize);
            partialCrystal.rotation.set(getRandomScale(-40, 40), getRandomScale(-40, 40), getRandomScale(-40, 40));
            partialCrystals.push(partialCrystal);

            let partialCrystalRoot = new THREE.Object3D();
            partialCrystalRoot.add(partialCrystal);
            partialCrystalRoot.rotation.set(0, beta, 0);
            partialCrystalRoots.push(partialCrystalRoot);
            partialCrystalParent.add(partialCrystalRoot);
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

        for (let i = 0; i < partialCrystalRoots.length; i++) {
            let x = getRandomScale(-2 * Math.PI, 2 * Math.PI);
            let y = getRandomScale(-2 * Math.PI, 2 * Math.PI);
            let z = getRandomScale(-2 * Math.PI, 2 * Math.PI);
            partialCrystalRoots[i].rotation.set(x, y, z);
        }

        //clone partial2 crystal
        partial2CrystalParent = new THREE.Object3D();
        totalRoot.add(partial2CrystalParent);

        let partial2CrystalIdx = 0;
        for (let i = 0; i < partial2CrystalCount; i++) {
            //Random point within sphere uniformly
            let symbolX = getRandomScale(-1, 1);
            symbolX = symbolX >= 0 ? 1 : -1;
            let symbolY = getRandomScale(-1, 1);
            symbolY = symbolY >= 0 ? 1 : -1;

            let alpha = 2 * Math.PI * getRandom();

            let ua = getRandomScale(45, 103);

            let rx = symbolX * ua * Math.cos(alpha);
            let rz = symbolY * ua * Math.sin(alpha);
            let ry = getRandomScale(-30, 30);

            let partial2Crystal = originPartialCrystals[partial2CrystalIdx].clone();
            partial2Crystal.material = sCrystalShader2;
            partial2CrystalIdx++;
            if (partial2CrystalIdx == originPartialCrystals.length) {
                partial2CrystalIdx = 0;
            }

            partial2Crystal.visible = false;
            partial2Crystal.position.set(rx, ry, rz);
            partial2Crystal.scale.set(partial2CrystalSize, partial2CrystalSize, partial2CrystalSize);
            partial2Crystal.rotation.set(getRandomScale(-40, 40), getRandomScale(-40, 40), getRandomScale(-40, 40));
            partial2Crystals.push(partial2Crystal);

            let partial2CrystalRoot = new THREE.Object3D();
            partial2CrystalRoot.add(partial2Crystal);
            partial2CrystalRoots.push(partial2CrystalRoot);
            partial2CrystalParent.add(partial2CrystalRoot);
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

            //Rotate Local Space
            let partial2CrystalAngleSpeed = new THREE.Vector3(getRandomScale(- 2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI), getRandomScale(-2 * Math.PI, 2 * Math.PI));
            partial2CrystalAngleSpeeds.push(partial2CrystalAngleSpeed);
        }

        //Logo
        logoCrystals.forEach(element => {
            totalRoot.add(element);
        });
        logoCrystalIdx = 0;
        logoCrystal = logoCrystals[logoCrystalIdx];
        logoCrystal.rotation.set(0, -Math.PI / 9, 0);
        totalRoot.rotation.set(0, Math.PI * 3.3 / 5 + Math.PI / 2, 0);
        //Effect Mesh
        let expGeo = new THREE.CircleGeometry(12, 30);
        let expBGeo = new THREE.BufferGeometry();
        expBGeo.fromGeometry(expGeo);
        var expMaterial = new THREE.MeshBasicMaterial({ map: null, side: THREE.DoubleSide, transparent: true });
        expMesh = new THREE.Mesh(expBGeo, expMaterial);
        expMesh.position.set(-120, camera.position.y * 0.9, 0);
        expMesh.rotation.set(0, Math.PI / 2, 0);

        expMesh.visible = false;
        cameraRoot.add(expMesh);

        let shineGeo = new THREE.CircleGeometry(12, 30);
        let shineBGeo = new THREE.BufferGeometry();
        shineBGeo.fromGeometry(shineGeo);
        var shineMaterial = new THREE.MeshBasicMaterial({ map: null, side: THREE.DoubleSide, transparent: true });
        shineMesh = new THREE.Mesh(shineBGeo, shineMaterial);
        shineMesh.position.set(-80, camera.position.y * 0.7, 0);
        shineMesh.rotation.set(0, Math.PI / 2, 0);
        shineMesh.visible = false;
        cameraRoot.add(shineMesh);


        let ringGeo = new THREE.TorusBufferGeometry(150, 0.4, 16, 100);
        ringMat = new THREE.MeshBasicMaterial({ color: 0x10e2b1, opacity: 1, transparent: true });
        ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
        ringMesh1.position.set(0, 0, 0);
        ringMesh1.rotation.set(Math.PI / 15, Math.PI / 4, 0);
        ringMesh1.scale.set(0.001, 0.001, 0.001);
        ringMesh1.visible = false;
        cameraRoot.add(ringMesh1);

        ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
        ringMesh2.position.set(0, -10, 0);
        ringMesh2.rotation.set(-Math.PI / 3, Math.PI / 0.8, 0);
        ringMesh2.scale.set(0.001, 0.001, 0.001);
        ringMesh2.visible = false;
        cameraRoot.add(ringMesh2);

        ringMesh3 = new THREE.Mesh(ringGeo, ringMat);
        ringMesh3.position.set(0, 0, 0);
        ringMesh3.rotation.set(Math.PI / 2, Math.PI / 12, 0);
        ringMesh3.scale.set(0.001, 0.001, 0.001);
        ringMesh3.visible = false;
        cameraRoot.add(ringMesh3);


        //Inv Ring
        let invRingGeo = new THREE.TorusBufferGeometry(80, 0.4, 16, 100);
        invRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 1, transparent: true });
        invRing1 = new THREE.Mesh(invRingGeo, invRingMat);
        invRing1.position.set(0, 0, 0);
        invRing1.rotation.set(Math.PI / 15, Math.PI / 4, 0);
        invRing1.scale.set(0.5, 0.5, 0.5);
        invRing1.visible = true;
        envSphere.add(invRing1);

        invRing2 = new THREE.Mesh(invRingGeo, invRingMat);
        invRing2.position.set(0, -10, 0);
        invRing2.rotation.set(-Math.PI / 3, Math.PI / 0.8, 0);
        // invRing2.scale.set(0.001, 0.001, 0.001);
        invRing2.visible = true;
        envSphere.add(invRing2);

        invRing3 = new THREE.Mesh(invRingGeo, invRingMat);
        invRing3.position.set(0, 0, 0);
        invRing3.rotation.set(Math.PI / 9, Math.PI / 12, 0);
        invRing3.scale.set(0.8, 0.8, 0.8);
        invRing3.visible = true;
        envSphere.add(invRing3);

        invRing4 = new THREE.Mesh(invRingGeo, invRingMat);
        invRing4.position.set(0, 0, 0);
        invRing4.rotation.set(-Math.PI / 2, Math.PI / 12, 0);
        invRing4.scale.set(1.5, 1.5, 1.5);
        invRing4.visible = true;
        envSphere.add(invRing4);

        invRing5 = new THREE.Mesh(invRingGeo, invRingMat);
        invRing5.position.set(0, 0, 0);
        invRing5.rotation.set(Math.PI / 5, -Math.PI / 3, 0);
        invRing5.scale.set(1.5, 1.5, 1.5);
        invRing5.visible = true;
        envSphere.add(invRing5);

        invRing6 = new THREE.Mesh(new THREE.TorusBufferGeometry(50, 0.5, 16, 100), invRingMat);
        invRing6.position.set(0, 0, 0);
        invRing6.rotation.set(Math.PI / 2, Math.PI / 12, 0);
        invRing6.visible = true;
        envSphere.add(invRing6);

    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        loadingPercent.textContent = Math.floor(itemsLoaded * 100 / itemsTotal);

    };

    manager.onError = function (url) {

        // console.log('There was an error loading ' + url);

    };

    var textureLoader = new THREE.TextureLoader(manager);

    var effectPath = assetPath + "effect/";
    expTextures = [];
    for (let i = 0; i < 61; i++) {
        let txt = textureLoader.load(effectPath + "exp/" + "img" + ((i < 10) ? "0" + i : i) + ".png");
        expTextures.push(txt);
    }
    shineTextures = [];
    for (let i = 0; i < 76; i++) {
        let txt = textureLoader.load(effectPath + "shine/" + "img" + ((i < 10) ? "0" + i : i) + ".png");
        shineTextures.push(txt);
    }
    ringTexture = textureLoader.load(effectPath + "ring.jpg");

    var texturePath = assetPath + "texture/";
    var envFileName = "env5"
    envMap = textureLoader.load(texturePath + "env/" + envFileName + ".jpg");
    sCrystalAlphaMap = textureLoader.load(texturePath + "small/alpha.jpg");
    sCrystalSpecularMap = textureLoader.load(texturePath + "small/specular.jpg");
    sCrystalNormalMap = textureLoader.load(texturePath + "small/normal.jpg");
    sCrystalBumpMap = textureLoader.load(texturePath + "small/bump.jpg");

    lCrystalAlphaMap1 = textureLoader.load(texturePath + "logo/alpha1.jpg");
    lCrystalSpecularMap1 = textureLoader.load(texturePath + "logo/specular1.jpg");
    lCrystalNormalMap1 = textureLoader.load(texturePath + "logo/normal1.jpg");
    lCrystalBumpMap1 = textureLoader.load(texturePath + "logo/bump1.jpg");

    lCrystalAlphaMap2 = textureLoader.load(texturePath + "logo/alpha2.jpg");
    lCrystalSpecularMap2 = textureLoader.load(texturePath + "logo/specular2.jpg");
    lCrystalNormalMap2 = textureLoader.load(texturePath + "logo/normal2.jpg");
    lCrystalBumpMap2 = textureLoader.load(texturePath + "logo/bump2.jpg");

    sCrystalShader1 = new THREE.RawShaderMaterial({
        vertexShader: "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float time;\nuniform float radius;\nuniform float rotationSpeed;\nuniform float animationParam1;\nuniform float animationParam2;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec3 randomValues;\nattribute vec3 offset;\nattribute float instanceIndex;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nfloat map_2_1(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\nvec3 rotateVec3_3_2(vec3 p, float angle, vec3 axis){\n  vec3 a = normalize(axis);\n  float s = sin(angle);\n  float c = cos(angle);\n  float r = 1.0 - c;\n  mat3 m = mat3(\n    a.x * a.x * r + c,\n    a.y * a.x * r + a.z * s,\n    a.z * a.x * r - a.y * s,\n    a.x * a.y * r - a.z * s,\n    a.y * a.y * r + c,\n    a.z * a.y * r + a.x * s,\n    a.x * a.z * r + a.y * s,\n    a.y * a.z * r - a.x * s,\n    a.z * a.z * r + c\n  );\n  return m * p;\n}\n\n\nfloat exponentialOut_4_3(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\n\n\n\nfloat getAnimationParam(float value, float randomValue) {\n  float r = randomValue * 0.2;\n  return map_2_1(value, r, r + 0.8, 0.0, 1.0, true);\n}\n\nvoid main() {\n  vec3 pos = position;\n  vec3 n = normal;\n  float groupIndex = mod(instanceIndex, 3.0);\n  if (groupIndex == 2.0) {\n    groupIndex = 1.0;\n  }\n  float r = radius * (1.0 + 0.5 * groupIndex);\n  float s = rotationSpeed * (1.0 + 0.8 * groupIndex);\n\n\n  float theta1 = time * 0.01 / 180.0 * PI_1_0 * randomValues.x + randomValues.y * 100.0;\n  float theta2 = time * 0.01 / 180.0 * PI_1_0 * randomValues.z + randomValues.x * 100.0;\n  float theta3 = -time * s / 180.0 * PI_1_0 * randomValues.y + randomValues.z * 100.0;\n\n  vec3 axisX = vec3(1.0, 0.0, 0.0);\n  vec3 axisY = vec3(0.0, 1.0, 0.0);\n  vec3 axisZ = vec3(0.0, 0.0, 1.0);\n\n  pos = rotateVec3_3_2(pos, theta1, axisX);\n  n = rotateVec3_3_2(n, theta1, axisX);\n  pos = rotateVec3_3_2(pos, theta2, axisZ);\n  n = rotateVec3_3_2(n, theta2, axisZ);\n\n  float p1 = exponentialOut_4_3(getAnimationParam(animationParam1, randomValues.x));\n  pos *= p1;\n\n  pos.x += (r + offset.x) * p1;\n  pos.y += (offset.y * p1);\n  pos = rotateVec3_3_2(pos, theta3, axisY);\n  n = rotateVec3_3_2(n, theta3, axisY);\n\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(n, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = (1.0 - animationParam2);\n  vLightValue = 0.0;\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n",
        fragmentShader: "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform samplerCube envMap;\nuniform sampler2D alphaMap;\nuniform sampler2D bumpMap;\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform float bumpRefraction;\n\nuniform mat4 matrixWorldInverse;\nuniform float refractionRatio;\nuniform vec3 lightPosition;\nuniform float alphaValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nvoid main(){\n  vec3 tBinormal = cross(vNormal, vTangent);\n  mat3 mView = mat3(vTangent, tBinormal, vNormal);\n\n  vec3 normal = mView * (normalize(texture2D(normalMap, vUv)) * 2.0 - 1.0).rgb;\n  vec4 specular = texture2D(specularMap, vUv);\n  specular.rgb *= 0.4;\n\n  vec3 invLight = normalize(matrixWorldInverse * vec4(lightPosition, 0.0)).xyz;\n  vec4 diffuse  = vec4(vec3(clamp(dot(normal, invLight), 0.1, 1.0)) * 3.0, 1.0);\n  vec4 bump = texture2D(bumpMap, vUv);\n\n  float alpha = texture2D(alphaMap, vUv).r;\n\n  float b = refractionRatio;\n  if(bumpRefraction == 1.0) {\n    b *= bump.g * 0.4;\n  }\n  vec3 ref = refract(normalize(vPos - vCameraPos), normal, b);\n  vec4 envColor = textureCube(envMap, ref);\n\n  vec4 destColor = diffuse * envColor * vColor;\n  destColor.a = alpha / alphaValue + alpha * vColorAnimationParam + vLightValue;\n  destColor.rgb += vColorAnimationParam + vLightValue;\n  gl_FragColor = destColor;\n}\n",
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
            envMapIntensity: {
                type: "1f",
                value: 0.5
            },
            normalMap: {
                type: "t",
                value: sCrystalNormalMap
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
                value: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            lightPosition: {
                type: "3f",
                value: [0, 0, 0]
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
                value: .001
            },
            alphaValue: {
                type: "1f",
                value: .1
            },
            animationParam1: {
                type: "1f",
                value: 1
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
    sCrystalShader2 = new THREE.RawShaderMaterial({
        vertexShader: "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float time;\nuniform float radius;\nuniform float rotationSpeed;\nuniform float animationParam1;\nuniform float animationParam2;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec3 randomValues;\nattribute vec3 offset;\nattribute float instanceIndex;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nfloat map_2_1(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\nvec3 rotateVec3_3_2(vec3 p, float angle, vec3 axis){\n  vec3 a = normalize(axis);\n  float s = sin(angle);\n  float c = cos(angle);\n  float r = 1.0 - c;\n  mat3 m = mat3(\n    a.x * a.x * r + c,\n    a.y * a.x * r + a.z * s,\n    a.z * a.x * r - a.y * s,\n    a.x * a.y * r - a.z * s,\n    a.y * a.y * r + c,\n    a.z * a.y * r + a.x * s,\n    a.x * a.z * r + a.y * s,\n    a.y * a.z * r - a.x * s,\n    a.z * a.z * r + c\n  );\n  return m * p;\n}\n\n\nfloat exponentialOut_4_3(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\n\n\n\nfloat getAnimationParam(float value, float randomValue) {\n  float r = randomValue * 0.2;\n  return map_2_1(value, r, r + 0.8, 0.0, 1.0, true);\n}\n\nvoid main() {\n  vec3 pos = position;\n  vec3 n = normal;\n  float groupIndex = mod(instanceIndex, 3.0);\n  if (groupIndex == 2.0) {\n    groupIndex = 1.0;\n  }\n  float r = radius * (1.0 + 0.5 * groupIndex);\n  float s = rotationSpeed * (1.0 + 0.8 * groupIndex);\n\n\n  float theta1 = time * 0.01 / 180.0 * PI_1_0 * randomValues.x + randomValues.y * 100.0;\n  float theta2 = time * 0.01 / 180.0 * PI_1_0 * randomValues.z + randomValues.x * 100.0;\n  float theta3 = -time * s / 180.0 * PI_1_0 * randomValues.y + randomValues.z * 100.0;\n\n  vec3 axisX = vec3(1.0, 0.0, 0.0);\n  vec3 axisY = vec3(0.0, 1.0, 0.0);\n  vec3 axisZ = vec3(0.0, 0.0, 1.0);\n\n  pos = rotateVec3_3_2(pos, theta1, axisX);\n  n = rotateVec3_3_2(n, theta1, axisX);\n  pos = rotateVec3_3_2(pos, theta2, axisZ);\n  n = rotateVec3_3_2(n, theta2, axisZ);\n\n  float p1 = exponentialOut_4_3(getAnimationParam(animationParam1, randomValues.x));\n  pos *= p1;\n\n  pos.x += (r + offset.x) * p1;\n  pos.y += (offset.y * p1);\n  pos = rotateVec3_3_2(pos, theta3, axisY);\n  n = rotateVec3_3_2(n, theta3, axisY);\n\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(n, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = (1.0 - animationParam2);\n  vLightValue = 0.0;\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n",
        fragmentShader: "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform samplerCube envMap;\nuniform sampler2D alphaMap;\nuniform sampler2D bumpMap;\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform float bumpRefraction;\n\nuniform mat4 matrixWorldInverse;\nuniform float refractionRatio;\nuniform vec3 lightPosition;\nuniform float alphaValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nvoid main(){\n  vec3 tBinormal = cross(vNormal, vTangent);\n  mat3 mView = mat3(vTangent, tBinormal, vNormal);\n\n  vec3 normal = mView * (normalize(texture2D(normalMap, vUv)) * 2.0 - 1.0).rgb;\n  vec4 specular = texture2D(specularMap, vUv);\n  specular.rgb *= 0.4;\n\n  vec3 invLight = normalize(matrixWorldInverse * vec4(lightPosition, 0.0)).xyz;\n  vec4 diffuse  = vec4(vec3(clamp(dot(normal, invLight), 0.1, 1.0)) * 3.0, 1.0);\n  vec4 bump = texture2D(bumpMap, vUv);\n\n  float alpha = texture2D(alphaMap, vUv).r;\n\n  float b = refractionRatio;\n  if(bumpRefraction == 1.0) {\n    b *= bump.g * 0.4;\n  }\n  vec3 ref = refract(normalize(vPos - vCameraPos), normal, b);\n  vec4 envColor = textureCube(envMap, ref);\n\n  vec4 destColor = diffuse * envColor * vColor;\n  destColor.a = alpha / alphaValue + alpha * vColorAnimationParam + vLightValue;\n  destColor.rgb += vColorAnimationParam + vLightValue;\n  gl_FragColor = destColor;\n}\n",
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
            envMapIntensity: {
                type: "1f",
                value: 0.5
            },
            normalMap: {
                type: "t",
                value: sCrystalNormalMap
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
                value: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            lightPosition: {
                type: "3f",
                value: [0, 0, 0]
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
                value: .001
            },
            alphaValue: {
                type: "1f",
                value: .1
            },
            animationParam1: {
                type: "1f",
                value: 1
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

    lCrystalShader1 = new THREE.RawShaderMaterial({
        vertexShader: "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float animationParam1;\nuniform float animationParam2;\nuniform float animationParam3;\nuniform float time;\nuniform float lightValueParam;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute float vertexRandomValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nfloat map_2_1(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\n// #pragma glslify: snoise3 = require('glsl-noise/simplex/3d')\nfloat exponentialOut_3_2(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\n\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backOut_4_3(float t) {\n  float f = 1.0 - t;\n  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));\n}\n\n\n\n\n\nfloat getAnimationParam(float value, float randomValue) {\n  float r = randomValue * 0.4;\n  return map_2_1(value, r, r + 0.6, 0.0, 1.0, true);\n}\n\nvoid main() {\n  vec3 pos = position;\n  pos *= exponentialOut_3_2(getAnimationParam(animationParam1, vertexRandomValue));\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n  float t = mod(time, 20000.0 * PI_1_0);\n  modelPos.x += animationParam3 * 0.1 * sin(t * 200.0);\n  modelPos.y += animationParam3 * 0.1 * sin(t * 400.0);\n  modelPos.z += animationParam3 * 0.1 * sin(t * 600.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = (1.0 - animationParam2);\n  float len = length(position.xyz);\n  vLightValue = min(lightValueParam / len / len * (0.6 + vertexRandomValue * 0.4), 0.6);\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n",
        fragmentShader: "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform samplerCube envMap;\nuniform sampler2D alphaMap;\nuniform sampler2D bumpMap;\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform float bumpRefraction;\n\nuniform mat4 matrixWorldInverse;\nuniform float refractionRatio;\nuniform vec3 lightPosition;\nuniform float alphaValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nvoid main(){\n  vec3 tBinormal = cross(vNormal, vTangent);\n  mat3 mView = mat3(vTangent, tBinormal, vNormal);\n\n  vec3 normal = mView * (normalize(texture2D(normalMap, vUv)) * 2.0 - 1.0).rgb;\n  vec4 specular = texture2D(specularMap, vUv);\n  specular.rgb *= 0.4;\n\n  vec3 invLight = normalize(matrixWorldInverse * vec4(lightPosition, 0.0)).xyz;\n  vec4 diffuse  = vec4(vec3(clamp(dot(normal, invLight), 0.1, 1.0)) * 3.0, 1.0);\n  vec4 bump = texture2D(bumpMap, vUv);\n\n  float alpha = texture2D(alphaMap, vUv).r;\n\n  float b = refractionRatio;\n  if(bumpRefraction == 1.0) {\n    b *= bump.g * 0.4;\n  }\n  vec3 ref = refract(normalize(vPos - vCameraPos), normal, b);\n  vec4 envColor = textureCube(envMap, ref);\n\n  vec4 destColor = diffuse * envColor * vColor;\n  destColor.a = alpha / alphaValue + alpha * vColorAnimationParam + vLightValue;\n  destColor.rgb += vColorAnimationParam + vLightValue;\n  gl_FragColor = destColor;\n}\n",
        transparent: true,
        uniforms: {
            alphaMap: {
                type: "t",
                value: lCrystalAlphaMap1
            },
            bumpMap: {
                type: "t",
                value: lCrystalBumpMap1
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
                value: lCrystalNormalMap1
            },
            specularMap: {
                type: "t",
                value: lCrystalSpecularMap1
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
                value: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            lightPosition: {
                type: "3f",
                value: [0, 0, 0]
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

    lCrystalShader2 = new THREE.RawShaderMaterial({
        vertexShader: "#define GLSLIFY 1\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float animationParam1;\nuniform float animationParam2;\nuniform float animationParam3;\nuniform float time;\nuniform float lightValueParam;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute float vertexRandomValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nconst float PI_1_0 = 3.1415926535897932384626433832795;\n\n\nfloat map_2_1(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {\n  if(clamp == true) {\n    if(value < inputMin) return outputMin;\n    if(value > inputMax) return outputMax;\n  }\n\n  float p = (outputMax - outputMin) / (inputMax - inputMin);\n  return ((value - inputMin) * p) + outputMin;\n}\n\n\n// #pragma glslify: snoise3 = require('glsl-noise/simplex/3d')\nfloat exponentialOut_3_2(float t) {\n  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\n\n\n\n#ifndef PI\n#define PI 3.141592653589793\n#endif\n\nfloat backOut_4_3(float t) {\n  float f = 1.0 - t;\n  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));\n}\n\n\n\n\n\nfloat getAnimationParam(float value, float randomValue) {\n  float r = randomValue * 0.4;\n  return map_2_1(value, r, r + 0.6, 0.0, 1.0, true);\n}\n\nvoid main() {\n  vec3 pos = position;\n  pos *= exponentialOut_3_2(getAnimationParam(animationParam1, vertexRandomValue));\n  vec4 modelPos = modelMatrix * vec4(pos, 1.0);\n  float t = mod(time, 20000.0 * PI_1_0);\n  modelPos.x += animationParam3 * 0.1 * sin(t * 200.0);\n  modelPos.y += animationParam3 * 0.1 * sin(t * 400.0);\n  modelPos.z += animationParam3 * 0.1 * sin(t * 600.0);\n\n  vPos = modelPos.xyz;\n  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;\n  vUv = uv;\n  vCameraPos = cameraPosition;\n  vTangent = cross(vNormal, vec3(0.0, 1.0, 0.0));\n  vColor = vec4(vec3(6.0), 1.0);\n  vColorAnimationParam = (1.0 - animationParam2);\n  float len = length(position.xyz);\n  vLightValue = min(lightValueParam / len / len * (0.6 + vertexRandomValue * 0.4), 0.6);\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n}\n",
        fragmentShader: "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform samplerCube envMap;\nuniform sampler2D alphaMap;\nuniform sampler2D bumpMap;\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform float bumpRefraction;\n\nuniform mat4 matrixWorldInverse;\nuniform float refractionRatio;\nuniform vec3 lightPosition;\nuniform float alphaValue;\n\nvarying vec3 vPos;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vCameraPos;\nvarying vec3 vTangent;\nvarying vec4 vColor;\nvarying float vColorAnimationParam;\nvarying float vLightValue;\n\nvoid main(){\n  vec3 tBinormal = cross(vNormal, vTangent);\n  mat3 mView = mat3(vTangent, tBinormal, vNormal);\n\n  vec3 normal = mView * (normalize(texture2D(normalMap, vUv)) * 2.0 - 1.0).rgb;\n  vec4 specular = texture2D(specularMap, vUv);\n  specular.rgb *= 0.4;\n\n  vec3 invLight = normalize(matrixWorldInverse * vec4(lightPosition, 0.0)).xyz;\n  vec4 diffuse  = vec4(vec3(clamp(dot(normal, invLight), 0.1, 1.0)) * 3.0, 1.0);\n  vec4 bump = texture2D(bumpMap, vUv);\n\n  float alpha = texture2D(alphaMap, vUv).r;\n\n  float b = refractionRatio;\n  if(bumpRefraction == 1.0) {\n    b *= bump.g * 0.4;\n  }\n  vec3 ref = refract(normalize(vPos - vCameraPos), normal, b);\n  vec4 envColor = textureCube(envMap, ref);\n\n  vec4 destColor = diffuse * envColor * vColor;\n  destColor.a = alpha / alphaValue + alpha * vColorAnimationParam + vLightValue;\n  destColor.rgb += vColorAnimationParam + vLightValue;\n  gl_FragColor = destColor;\n}\n",
        transparent: true,
        uniforms: {
            alphaMap: {
                type: "t",
                value: lCrystalAlphaMap2
            },
            bumpMap: {
                type: "t",
                value: lCrystalBumpMap2
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
                value: lCrystalNormalMap2
            },
            specularMap: {
                type: "t",
                value: lCrystalSpecularMap2
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
                value: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            lightPosition: {
                type: "3f",
                value: [0, 0, 0]
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

    //Create Environment Sphere
    envSphere = new THREE.Mesh(
        new THREE.SphereGeometry(350, 64, 64),
        new THREE.MeshBasicMaterial({
            map: textureLoader.load(texturePath + "env/" + envFileName + ".jpg"),
            side: THREE.DoubleSide,
        })
    );
    envSphere.scale.x *= -1;
    scene.add(envSphere)
    envSphere.visible = false;


    //Create root of total objects
    totalRoot = new THREE.Object3D()

    //Load logo crystal model
    var modelPath = assetPath + "model/";
    for (let i = 0; i < 2; i++) {
        new THREE.OBJLoader(manager).setPath(modelPath).load('logo' + (i + 1) + '.obj', function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {

                    child.material.dispose();

                    noise.seed(Math.random());
                    let vertices = [];
                    let uvs = [];
                    let normals = [];
                    let vertexRandomValues = [];
                    let geometry = new THREE.BufferGeometry();

                    let len = child.geometry.attributes.position.array.length;
                    for (let i = 0; i < len / 3; i++) {
                        let x = child.geometry.attributes.position.array[3 * i + 0];
                        let y = child.geometry.attributes.position.array[3 * i + 1];
                        let z = child.geometry.attributes.position.array[3 * i + 2];
                        vertices.push(x);
                        vertices.push(y);
                        vertices.push(z);
                        uvs.push(child.geometry.attributes.uv.array[2 * i + 0]);
                        uvs.push(child.geometry.attributes.uv.array[2 * i + 1]);
                        normals.push(child.geometry.attributes.normal.array[3 * i + 0]);
                        normals.push(child.geometry.attributes.normal.array[3 * i + 1]);
                        normals.push(child.geometry.attributes.normal.array[3 * i + 2]);
                        //noise.simplex3() -> [-1, 1]
                        //vertexRandomValue -> [0, 2]
                        vertexRandomValues.push((noise.simplex3(x / 2, y / 2, z / 2) + 1) / 2);
                    }
                    child.geometry.dispose();

                    let positions = new Float32Array(vertices);
                    geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
                    geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
                    geometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
                    geometry.addAttribute("vertexRandomValue", new THREE.BufferAttribute(new Float32Array(vertexRandomValues), 1));
                    geometry.computeVertexNormals();

                    child.geometry = geometry;

                    child.scale.set(0.15, 0.15, 0.15);
                    if (i == 0) {
                        child.material = lCrystalShader1;
                    } else if (i == 1) {
                        child.material = lCrystalShader2;
                    }

                    child.visible = false;
                    logoCrystals.push(child);

                }
            });

        });
    }


    //Load partial crystal model
    for (let i = 0; i < 3; i++) {
        new THREE.OBJLoader(manager).setPath(modelPath).load((i + 1) + '.obj', function (object) {
            object.visible = false;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.dispose();

                    let vertices = [];
                    let uvs = [];
                    let normals = [];
                    let geometry = new THREE.BufferGeometry();

                    let len = child.geometry.attributes.position.array.length;
                    for (let i = 0; i < len / 3; i++) {
                        let x = child.geometry.attributes.position.array[3 * i + 0];
                        let y = child.geometry.attributes.position.array[3 * i + 1];
                        let z = child.geometry.attributes.position.array[3 * i + 2];
                        vertices.push(x);
                        vertices.push(y);
                        vertices.push(z);
                        uvs.push(child.geometry.attributes.uv.array[2 * i + 0]);
                        uvs.push(child.geometry.attributes.uv.array[2 * i + 1]);
                        normals.push(child.geometry.attributes.normal.array[3 * i + 0]);
                        normals.push(child.geometry.attributes.normal.array[3 * i + 1]);
                        normals.push(child.geometry.attributes.normal.array[3 * i + 2]);
                    }
                    child.geometry.dispose();

                    geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
                    geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
                    geometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
                    geometry.computeVertexNormals();

                    child.geometry = geometry;

                    originPartialCrystals.push(child);
                }
            })

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
    document.addEventListener('touchcancel', onDocumentTouchCancel, false);
    window.addEventListener('resize', onWindowResize, false);
    window.onscroll = function(){
        if(!loaded)
            window.scrollTo(0, 0);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////

}

$('.indicator').on({ 'mousedown' : function(){
    pickLogo = true;
}});
$('.indicator').on({ 'mouseup' : function(){
    pickLogo = false;
}});
$('.indicator').on({ 'touchstart' : function(){
    pickLogo = true;
}});
$('.indicator').on({ 'touchend' : function(){
    pickLogo = false;
}});
$('.indicator').on({ 'touchcancel' : function(){
    pickLogo = false;
}});

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

    raycaster.setFromCamera(pickMouse, camera);
    var intersects = raycaster.intersectObjects([logoCrystal]);
    if (intersects.length > 0) {
        pickLogo = true;
    }
}
function onDocumentMouseUp() {
    isMouseDown = false;
}
function onDocumentMouseMove(event) {
    event.preventDefault();

    pickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    pickMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouseX = event.clientX - windowHalfX;
    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    mouseY = event.clientY// - windowHalfY;
    targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
    //Animation for mouse hover

    if (totalRoot) {

        if (isMouseDown) {
            if (currentState == State.Laround) {
                let y = (event.clientX - oldDownPosX) * 0.05;
                oldDownPosX = event.clientX;

                TweenMax.killTweensOf(totalRoot);
                TweenMax.to(totalRoot.rotation, 3, {
                    ease: Expo.easeOut,
                    y: totalRoot.rotation.y + y,
                    onUpdate: function (t) {

                    }
                })
            }
            else {
                if (isFixed) {
                    if (logoCrystalIdx != 0) {
                        let y = (event.clientX - oldDownPosX) * 0.05;
                        oldDownPosX = event.clientX;

                        TweenMax.killTweensOf(totalRoot);
                        TweenMax.to(totalRoot.rotation, 3, {
                            ease: Expo.easeOut,
                            y: totalRoot.rotation.y + y,
                            onUpdate: function (t) {

                            }
                        })
                    }
                }
                else {
                    let y = (event.clientX - oldDownPosX) * 0.05;
                    oldDownPosX = event.clientX;

                    TweenMax.killTweensOf(totalRoot);
                    TweenMax.to(totalRoot.rotation, 3, {
                        ease: Expo.easeOut,
                        y: totalRoot.rotation.y + y,
                        onUpdate: function (t) {

                        }
                    })
                }
            }



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
                z: x,
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
        // event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationXOnMouseDown = targetRotationX;
        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationYOnMouseDown = targetRotationY;

        oldDownPosX = event.touches[0].pageX;
        oldDownPosY = event.touches[0].pageY;
    }

    raycaster.setFromCamera(pickMouse, camera);
    var intersects = raycaster.intersectObjects([logoCrystal]);
    if (intersects.length > 0) {
        pickLogo = true;
    }
}
function onDocumentTouchEnd(event) {
    isMouseDown = false;
}
function onDocumentTouchCancel(event) {
    isMouseDown = false;
}
function onDocumentTouchMove(event) {
    if (!isMouseDown)
        return;
    if (event.touches.length == 1) {
        // event.preventDefault();
        pickMouse.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
        pickMouse.y = - (event.touches[0].pageY / window.innerHeight) * 2 + 1;

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
        mouseY = event.touches[0].pageY// - windowHalfY;
        targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
        //Animation for mouse hover

        if (totalRoot) {

            if (isMouseDown) {
                if (currentState == State.Laround) {
                    let y = (event.touches[0].pageX - oldDownPosX) * 0.05;
                    oldDownPosX = event.touches[0].pageX;

                    TweenMax.killTweensOf(totalRoot);
                    TweenMax.to(totalRoot.rotation, 3, {
                        ease: Expo.easeOut,
                        y: totalRoot.rotation.y + y,
                        onUpdate: function (t) {

                        }
                    })
                }
                else {
                    if (isFixed) {
                        if (logoCrystalIdx != 0) {
                            let y = (event.touches[0].pageX - oldDownPosX) * 0.05;
                            oldDownPosX = event.touches[0].pageX;

                            TweenMax.killTweensOf(totalRoot);
                            TweenMax.to(totalRoot.rotation, 3, {
                                ease: Expo.easeOut,
                                y: totalRoot.rotation.y + y,
                                onUpdate: function (t) {

                                }
                            })
                        }
                    }
                    else {
                        let y = (event.touches[0].pageX - oldDownPosX) * 0.05;
                        oldDownPosX = event.touches[0].pageX;

                        TweenMax.killTweensOf(totalRoot);
                        TweenMax.to(totalRoot.rotation, 3, {
                            ease: Expo.easeOut,
                            y: totalRoot.rotation.y + y,
                            onUpdate: function (t) {

                            }
                        })
                    }
                }
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
                    z: x,
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
    composer.reset();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function partialCrystalUpdate(time, texture, pos) {
    for (let i = 0; i < partialCrystalCount; i++) {
        if (partialCrystals[i]) {

            partialCrystals[i].material.uniforms.time.value = time;
            partialCrystals[i].material.uniforms.envMap.value = texture;
            partialCrystals[i].material.uniforms.alphaValue.value = alphaTimer.val;
            partialCrystals[i].material.uniforms.lightPosition.value = pos;
            partialCrystals[i].material.uniforms.matrixWorldInverse.value = partialCrystals[i].matrixWorld.getInverse(partialCrystals[i].matrixWorld);
            partialCrystals[i].material.uniforms["animationParam1"].value = 1;
            partialCrystals[i].material.uniforms["animationParam2"].value = brightnessValue.value;
            partialCrystals[i].material.uniforms.lightValueParam.value = lightValueParam.value;
            partialCrystals[i].material.uniforms.radius = 0;//distanceVector(partialCrystals[i].position, new THREE.Vector3(0, 0, 0));
            partialCrystals[i].material.needsUpdate = true;
        }
    }
}

function partial2CrystalUpdate(time, texture, pos) {
    for (let i = 0; i < partial2CrystalCount; i++) {
        if (partial2Crystals[i]) {
            partial2Crystals[i].material.uniforms.time.value = time;
            partial2Crystals[i].material.uniforms.envMap.value = texture;
            partial2Crystals[i].material.uniforms.alphaValue.value = alphaTimer.val;
            partial2Crystals[i].material.uniforms.lightPosition.value = pos;
            partial2Crystals[i].material.uniforms.matrixWorldInverse.value = partial2Crystals[i].matrixWorld.getInverse(partial2Crystals[i].matrixWorld)
            partial2Crystals[i].material.uniforms["animationParam1"].value = gatherParam.value;
            partial2Crystals[i].material.uniforms["animationParam2"].value = brightnessValue.value;
            partial2Crystals[i].material.uniforms.lightValueParam.value = lightValueParam.value;
            partial2Crystals[i].material.uniforms.radius = 0;// distanceVector(partial2Crystals[i].position, new THREE.Vector3(0, 0, 0));
            partial2Crystals[i].material.needsUpdate = true;
        }
    }
}

function logoCrystalUpdate(time, texture, pos) {
    if (logoCrystal != null) {
        logoCrystal.material.uniforms.time.value = time + 100;
        logoCrystal.material.uniforms.envMap.value = texture;
        logoCrystal.material.uniforms.alphaValue.value = alphaTimer.val;
        logoCrystal.material.uniforms.lightPosition.value = pos;
        logoCrystal.material.uniforms.matrixWorldInverse.value = logoCrystal.matrixWorld.getInverse(logoCrystal.matrixWorld);
        logoCrystal.material.uniforms["animationParam1"].value = gatherParam.value;
        logoCrystal.material.uniforms["animationParam2"].value = brightnessValue.value;
        logoCrystal.material.uniforms["animationParam3"].value = vibrateValue.value;
        logoCrystal.material.uniforms.lightValueParam.value = lightValueParam.value;
        logoCrystal.material.needsUpdate = true;
    }
}

function expUpdate(texture) {
    if (expMesh) {
        expMesh.material.map = texture;
        expMesh.material.needsUpdate = true;
    }
}

function ringUpdate(texture) {
    if (shineMesh) {
        shineMesh.material.map = texture;
        shineMesh.material.needsUpdate = true;
    }
}

function render() {
    if (!loaded)
        return;

    camera.updateMatrixWorld();

    envSphere.visible = true;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Shader
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    envSphere.rotation.y -= Math.PI / 180 / 8;
    let time = (new Date).getTime() - startTime;
    let t = time / 180 * Math.PI / 20;

    lightPosition.x = 0;
    lightPosition.y = 0;
    lightPosition.z = 0;

    partialCrystalUpdate(time, cubeCamera1.renderTarget.texture, lightPosition);
    partial2CrystalUpdate(time, cubeCamera1.renderTarget.texture, lightPosition);
    logoCrystalUpdate(time, cubeCamera1.renderTarget.texture, lightPosition);
    cubeCamera2.update(renderer, scene);
    cubeCamera2.renderTarget.texture.needsUpdate = true;
    cubeCamera1.update(renderer, scene);
    cubeCamera1.renderTarget.texture.needsUpdate = true;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Animation
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var delta = 5 * clock.getDelta();

    if (alphaTimer.val > alphaTimer.max) {
        alphaTimer.inc = false;
    }
    if (alphaTimer.val < alphaTimer.min) {
        alphaTimer.inc = true;
    }
    if (alphaTimer.inc) {
        alphaTimer.val += alphaTimer.step;
    }
    else {
        alphaTimer.val -= alphaTimer.step;
    }

    if (currentState == State.End || currentState == State.LogoAround || currentState == State.LogoGather || currentState == State.LogoAppear || currentState == State.Partial) {
        //Logo Crystal Animation
        if (isFixed) {
            if (logoCrystalIdx != 0) {
                logoCrystal.rotation.y += 0.023 * delta;
            }
        }
        else {
            logoCrystal.rotation.y += 0.023 * delta;
        }

        //Partial2 Crystal Animation    
        partial2CrystalParent.rotation.y += 0.023 * delta;
        for (let i = 0; i < partial2CrystalCount; i++) {
            //Rotate in local space
            if (partial2Crystals[i]) {
                partial2Crystals[i].rotation.x += partial2CrystalAngleSpeeds[i].x / 540;
                partial2Crystals[i].rotation.y += partial2CrystalAngleSpeeds[i].y / 540;
                partial2Crystals[i].rotation.z += partial2CrystalAngleSpeeds[i].z / 540;
            }
        }
    }

    //Partial Crystal Animation
    for (let i = 0; i < partialCrystalCount; i++) {
        //Rotate local space
        if (partialCrystals[i]) {
            partialCrystals[i].rotation.x += partialCrystalAngleSpeeds[i].x / 360;
            partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].y / 360;
            partialCrystals[i].rotation.z += partialCrystalAngleSpeeds[i].z / 360;
        }

        //Rotate world space
        if (partialCrystalRoots[i]) {
            if (currentState == State.Laround) {
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x / 3000;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y / 3000;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z / 3000;
            }
            if (currentState == State.Lgather || currentState == State.Saround || currentState == State.Sgather || currentState == State.Logo || currentState == State.End) {
                // accelTimerForRootAngle += isMobile ? 0.000005 : 0.000001;
                accelTimerForRootAngle += 0.00000087;
                let a = 0.0001 - accelTimerForRootAngle;
                a = a > 0 ? 0 : Math.abs(a);
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x / 1000 + a;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y / 1000 + a;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z / 1000 + a;
            }
        }
    }


    switch (currentState) {
        case State.Laround:
            if (autoCreate)
                isMouseDown = true;
            //Animation by mouse
            if (isMouseDown) {
                downTimer += delta;
                if (downTimer > State.times[currentState].value) {
                    currentState = State.Lgather;
                    //Anim Lgather
                    let idx = 0;
                    partialCrystals.forEach(partCrystal => {
                        //Random point within sphere uniformly
                        let symbolX = getRandomScale(-1, 1);
                        symbolX = symbolX >= 0 ? 1 : -1;
                        let symbolY = getRandomScale(-1, 1);
                        symbolY = symbolY >= 0 ? 1 : -1;

                        let alpha = 2 * Math.PI * getRandom();

                        let ua = getRandomScale(25, 28);

                        let rx = symbolX * ua * Math.cos(alpha);
                        let rz = symbolY * ua * Math.sin(alpha);
                        let ry = 0;
                        // partialCrystalRoots[idx].rotation.set(0, beta, 0);

                        // let rx = initPositionOfPartialCrystals[idx].x * 0.3;
                        // let ry = initPositionOfPartialCrystals[idx].y * 0.3;
                        // let rz = initPositionOfPartialCrystals[idx].z * 0.3;


                        let sx = initScaleOfPartialCrystals[idx].x * 0.7;
                        let sy = initScaleOfPartialCrystals[idx].y * 0.7;
                        let sz = initScaleOfPartialCrystals[idx].z * 0.7;
                        TweenMax.killTweensOf(partCrystal);
                        TweenMax.to(partCrystal.position, 2, {
                            ease: Sine.easeInOut,
                            x: rx,
                            y: ry,
                            z: rz
                        });
                        TweenMax.to(partCrystal.scale, 2, {
                            ease: Sine.easeInOut,
                            x: sx,
                            y: sy,
                            z: sz
                        });
                        idx++;
                    });
                }
            }
            else {
                downTimer -= delta;
                if (downTimer < 0)
                    downTimer = 0;
            }
            if (autoCreate)
                isMouseDown = false;
            break;

        case State.Lgather:
            if (autoCreate)
                isMouseDown = true;
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
                    TweenMax.to(partCrystal.position, 5.9, {
                        x: initPositionOfPartialCrystals[idx].x,
                        y: initPositionOfPartialCrystals[idx].y,
                        z: initPositionOfPartialCrystals[idx].z,
                        ease: Expo.easeOut
                    });
                    TweenMax.to(partCrystal.scale, 5.5, {
                        x: initScaleOfPartialCrystals[idx].x,
                        y: initScaleOfPartialCrystals[idx].y,
                        z: initScaleOfPartialCrystals[idx].z,
                        ease: Expo.easeOut,
                        onComplete() {
                        },
                        onUpdate() {
                        }
                    });

                    idx++;
                });
                TweenMax.to(brightnessValue, 5, {
                    ease: Sine.easeInOut,
                    value: 1,
                });
            }
            if (autoCreate)
                isMouseDown = false;
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
                    TweenMax.to(partCrystal.position, 0.7, {
                        ease: Sine.easeInOut,
                        x: 0,
                        y: 0,
                        z: 0,
                        onComplete() {
                        },
                        onUpdate() {
                        }
                    });
                });
                TweenMax.to(brightnessValue, 0.7, {
                    ease: Sine.easeInOut,
                    value: 0.1,
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
                shineMesh.visible = true;
                logoCrystal = logoCrystals[logoCrystalIdx];
                logoCrystal.visible = true;
                logoCrystal.rotation.set(0, -Math.PI / 9, 0);
                totalRoot.rotation.set(0, Math.PI * 3.3 / 5 + Math.PI / 2, 0);

                //Control Logo crystal
                // TweenMax.killTweensOf(logoCrystal);
                TweenMax.to(gatherParam, 3, {
                    ease: Power1.easeInOut,
                    value: 1
                });

                let idx = 0;
                partial2Crystals.forEach(part2Crystal => {
                    part2Crystal.visible = true;
                    TweenMax.killTweensOf(part2Crystal);
                    TweenMax.to(part2Crystal.position, 1.5, {
                        ease: Power1.easeInOut,
                        x: initPositionOfPartial2Crystals[idx].x,
                        y: initPositionOfPartial2Crystals[idx].y,
                        z: initPositionOfPartial2Crystals[idx].z,
                    });
                    TweenMax.to(part2Crystal.scale, 1.5, {
                        ease: Power1.easeInOut,
                        x: initScaleOfPartial2Crystals[idx].x,
                        y: initScaleOfPartial2Crystals[idx].y,
                        z: initScaleOfPartial2Crystals[idx].z,
                        onComplete() {
                        },
                        onUpdate() {
                        }
                    });
                    idx++;
                });

                TweenMax.to(brightnessValue, 2.5, {
                    ease: Power4.easeIn,
                    value: 1,
                });

                ringMesh1.visible = true;
                ringMesh2.visible = true;
                ringMesh3.visible = true;
                ringMat.opacity = 1;
                TweenMax.to(ringMesh1.scale, 2, {
                    ease: Power1.easeInOut,
                    x: 1,
                    y: 2,
                    z: 1,
                    onComplete() {
                        ringMesh1.visible = false;
                        ringMesh1.scale.set(0.001, 0.001, 0.001);
                    }
                });

                TweenMax.to(ringMesh2.scale, 2, {
                    ease: Power1.easeInOut,
                    x: 1,
                    y: 2,
                    z: 1,
                    delay: 0.15,
                    onComplete() {
                        ringMesh2.visible = false;
                        ringMesh2.scale.set(0.001, 0.001, 0.001);
                    }
                });

                TweenMax.to(ringMesh3.scale, 2, {
                    ease: Power1.easeInOut,
                    x: 1,
                    y: 1,
                    z: 1,
                    delay: 0.3,
                    onComplete() {
                        ringMesh3.visible = false;
                        ringMesh3.scale.set(0.001, 0.001, 0.001);
                    }
                });

                TweenMax.to(ringMat, 3, {
                    ease: Power1.easeInOut,
                    opacity: 0
                });

            }
            break;
        case State.End:

            if (!autoCreate)
                autoCreate = true;
            downTimer = 0;
            accelTimerForRootAngle = 0;
            scene.remove(partialCrystalParent);
            for (let i = 0; i < partialCrystalCount; i++) {
                scene.remove(partialCrystalRoots[i]);
                scene.remove(partialCrystals[i]);
                // partialCrystals[i].geometry.dispose();
                // partialCrystals[i].material.dispose();
            }
            partialCrystals.forEach(partCrystal => {
                partCrystal.visible = false;
            })
            currentState = State.LogoAround;
            holderContainer.classList.remove("hidden");
            break;
        case State.LogoAround:
            //Animation by mouse
            if (isMouseDown) {
                if (pickLogo) {
                    downTimer += delta;
                    if (downTimer > State.times[currentState].value) {
                        currentState = State.LogoGather;
                    }
                }
            }
            else {
                pickLogo = false;
                downTimer -= delta;
                if (downTimer < 0)
                    downTimer = 0;

            }
            break;

        case State.LogoGather:
            if (isMouseDown) {
                //Vibrate
                vibrateValue.value = 5;

                downTimer += delta;
                if (downTimer > State.times[currentState].value) {
                    currentState = State.LogoAppear;
                    //Anim Lgather
                    partial2Crystals.forEach(part2Crystal => {
                        //Random point within sphere uniformly
                        let rx = 0;
                        let ry = 0;
                        let rz = 0;
                        let sx = 0.01;
                        let sy = 0.01;
                        let sz = 0.01;
                        TweenMax.killTweensOf(part2Crystal);
                        TweenMax.to(part2Crystal.position, 1.2, {
                            ease: Sine.easeInOut,
                            x: rx,
                            y: ry,
                            z: rz,
                            delay: 0.5
                        });
                        // TweenMax.to(part2Crystal.scale, 1.9, {
                        //     ease: Sine.easeInOut,
                        //     x: sx,
                        //     y: sy,
                        //     z: sz,
                        //     delay: 0.2
                        // });
                    });

                    TweenMax.killTweensOf(gatherParam);
                    TweenMax.to(gatherParam, 1.9, {
                        ease: Sine.easeInOut,
                        value: 0,
                        onComplete() {
                            vibrateValue.value = 0;
                        },
                    });

                    downTimer = 0;

                    TweenMax.killTweensOf(brightnessValue);
                    TweenMax.to(brightnessValue, 1.9, {
                        ease: Sine.easeInOut,
                        value: 0.1
                    });

                }
            }
            else {
                currentState = State.LogoAround;
                downTimer = 0;
                vibrateValue.value = 0;
            }
            break;
        case State.LogoAppear:
            if (isMouseDown) {
                downTimer += delta;
                if (downTimer > State.times[currentState].value) {
                    logoCrystalIdx++;
                    if (logoCrystalIdx >= 2) {
                        logoCrystalIdx = 0;
                    }
                    holderContainer.classList.add("hidden");

                    currentState = State.Partial;
                    pickLogo = false;
                    isMouseDown = false;
                    downTimer = 0;
                    logoCrystal.visible = false;
                    partial2Crystals.forEach(partial2Crystal => {
                        partial2Crystal.visible = false;
                    });
                    partialCrystals.forEach(partCrystal => {
                        partCrystal.visible = true;
                    });
                    let idx = 0;
                    partialCrystals.forEach(partCrystal => {
                        TweenMax.killTweensOf(partCrystal);
                        TweenMax.to(partCrystal.position, 1.5, {
                            x: initPositionOfPartialCrystals[idx].x,
                            y: initPositionOfPartialCrystals[idx].y,
                            z: initPositionOfPartialCrystals[idx].z,
                            ease: Expo.easeOut
                        });
                        TweenMax.to(partCrystal.scale, 1.5, {
                            ease: Expo.easeOut,
                            x: initScaleOfPartialCrystals[idx].x,
                            y: initScaleOfPartialCrystals[idx].y,
                            z: initScaleOfPartialCrystals[idx].z,
                            onComplete() {
                                // currentState = State.Saround;
                            },
                            onUpdate() {

                            }
                        });
                        idx++;
                    });
                    TweenMax.to(brightnessValue, 1.5, {
                        ease: Expo.easeOut,
                        value: 1
                    });
                }
            }
            else {
                //Return origin position
                currentState = State.LogoAround;
                downTimer = 0;
                accelTimerForRootAngle = 0;
                let idx = 0;
                partial2Crystals.forEach(part2Crystal => {
                    TweenMax.killTweensOf(part2Crystal);
                    TweenMax.to(part2Crystal.position, 2, {
                        x: initPositionOfPartial2Crystals[idx].x,
                        y: initPositionOfPartial2Crystals[idx].y,
                        z: initPositionOfPartial2Crystals[idx].z,
                        ease: Expo.easeOut
                    });
                    TweenMax.to(part2Crystal.scale, 2, {
                        ease: Expo.easeOut,
                        x: initScaleOfPartial2Crystals[idx].x,
                        y: initScaleOfPartial2Crystals[idx].y,
                        z: initScaleOfPartial2Crystals[idx].z,
                        onComplete() {
                        },
                        onUpdate() {
                        }
                    });

                    idx++;
                });

                // TweenMax.killTweensOf(logoCrystal);
                // TweenMax.to(logoCrystal.scale, 2, {
                //     ease: Expo.easeOut,
                //     x: 1,
                //     y: 1,
                //     z: 1,
                // });

                TweenMax.to(gatherParam, 2.5, {
                    ease: Expo.easeOut,
                    value: 1
                });

                TweenMax.to(brightnessValue, 1.5, {
                    ease: Expo.easeOut,
                    value: 1
                });
                vibrateValue.value = 0;
            }
            break;
        case State.Partial:
            downTimer += delta;
            if (downTimer > State.times[currentState].value) {
                downTimer = 0;
                currentState = State.Laround;
            }
            break;
        default:
            break;
    }

    if (startEffect) {
        expUpdate(expTextures[Math.floor(expTimer)]);
        ringUpdate(shineTextures[Math.floor(ringTimer)]);
        expTimer += delta * 3.2;
        ringTimer += delta * 3.95;

        if (expTimer > expTextures.length || ringTimer > shineTextures.length) {
            startEffect = false;
            expMesh.visible = false;
            shineMesh.visible = false;
            TweenMax.killTweensOf(logoCrystal);
            TweenMax.to(logoCrystal.position, 1, {
                x: 0,
                y: 0,
                z: 0,
                ease: Sine.easeInOut
            });
        }

    }

    envSphere.visible = false;

    renderer.render(scene, camera);
    composer.render(0.01);
}
