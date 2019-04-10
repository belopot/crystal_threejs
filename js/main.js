if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var container;
var camera, scene, renderer, composer, clock;
var crystalMaterial, markerMaterial;
var hdrCubeRenderTarget;
var logoCrystal;
var partialCrystals = [];
var partialCrystalRoots = [];
var partialCrystalRootAngleSpeeds = [];
var partialCrystalAngleSpeeds = [];
var radiusPartialCrystals = [];
var initPositionOfPartialCrystals = [];
var centralModel;
var partialCrystalCount = 80;

//Camera Animation
var targetRotationX = 0;
var targetRotationY = 0;
var targetRotationXOnMouseDown = 0;
var targetRotationYOnMouseDown = 0;
var mouseX = 0;
var mouseY = 0;
var oldMouseX = 0;
var oldMouseY = 0;
var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var isMouseDown = false;
var centralModelTimer = 0;
var animTimer = 0;


//Gather mesh
var mouseDownTimer = 0;

var State = {
    Laround: 1,
    Lgather: 2,
    Saround: 3,
    Sgather: 4,
    Logo: 5,
    times: {
        1: { value: 5 },
        2: { value: 2 },
        3: { value: 2 },
        4: { value: 1 },
        5: { value: 0 },
    }
};

var currentState = State.Laround;

var getRandom = function (max) {
    var min = -max;
    var rand = Math.random();
    var _max = 2 * max;
    var val = rand * _max;
    val = val + min;
    return val;
};

function getRandomScale(low, high) {
    return Math.random() * (high - low) + low
};

function distanceVector(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};


init();
animate();

function init() {

    container = document.getElementById('container');
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
    camera.position.z = 155;
    camera.position.y = -2;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    //////////////////////////////////////////////////////////////////////////////////////////////
    //Light
    //////////////////////////////////////////////////////////////////////////////////////////////
    var intensity = 1000.5;
    ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 30, -1);
    scene.add(directionalLight);

    var pointLight1 = new THREE.PointLight(0x0000ff);
    pointLight1.position.set(30, 10, 0);
    pointLight1.intensity = intensity;
    pointLight1.castShadow = false;
    scene.add(pointLight1);
    var pointLight2 = new THREE.PointLight(0x0000ff);
    pointLight2.position.set(-30, 0, 0);
    pointLight2.intensity = intensity;
    scene.add(pointLight2);
    var pointLight3 = new THREE.PointLight(0x0000ff);
    pointLight3.position.set(0, -10, -30);
    pointLight3.intensity = intensity;
    scene.add(pointLight3);
    var pointLight4 = new THREE.PointLight(0x0000ff);
    pointLight4.position.set(0, 0, 40);
    pointLight4.intensity = intensity;
    scene.add(pointLight4);

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Clock
    //////////////////////////////////////////////////////////////////////////////////////////////
    clock = new THREE.Clock();

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Effects
    /////////////////////////////////////////////////////////////////////////////////////////////
    var renderModel = new THREE.RenderPass(scene, camera);
    var effectBloom = new THREE.BloomPass(1.4);
    var effectFilm = new THREE.FilmPass(0.1, 0.1, 2048, false);
    effectFilm.renderToScreen = true;

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Import model
    /////////////////////////////////////////////////////////////////////////////////////////////
    var manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onLoad = function () {

        // console.log('Loading complete!');

    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onError = function (url) {

        // console.log('There was an error loading ' + url);

    };

    var textureLoader = new THREE.TextureLoader(manager);

    //Crystal Material
    crystalMaterial = new THREE.MeshPhysicalMaterial({
        // color: 0x0000ff,
        emissive: 0x000011,
        roughness: 0.005,
        metalness: 1,
        reflectivity: 30.4,
        refractionRatio: 7.9,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        // envMapIntensity: 1.5,
        // envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/diffuse.png"),
        alphaMap: textureLoader.load("Assets/texture/opacity.png"),
        specularMap: textureLoader.load("Assets/texture/glossiness.png"),
        lightMap: textureLoader.load("Assets/texture/glossiness.png"),
        normalMap: textureLoader.load("Assets/texture/normal.png"),
        normalScale: new THREE.Vector2(2.7, 2.7),
    });

    //Logo Material
    logoMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        emissive: 0x000022,
        roughness: 0.1,
        metalness: 1.0,
        reflectivity: 0.4,
        refractionRatio: 0.9,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        envMapIntensity: 1.5,
        envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/logo/diffuse.png"),
        alphaMap: textureLoader.load("Assets/texture/logo/opacity.png"),
        specularMap: textureLoader.load("Assets/texture/logo/glossiness.png"),
        lightMap: textureLoader.load("Assets/texture/logo/glossiness.png"),
        normalMap: textureLoader.load("Assets/texture/logo/normal.png"),
        normalScale: new THREE.Vector2(1.7, 1.7),
    });

    //Photo Material
    markerMaterial = new THREE.MeshBasicMaterial({
        // color: 0x0000ff,
        emissive: 0x000011,
        roughness: 1,
        metalness: 1,
        // reflectivity: 0.4,
        // refractionRatio: 0.9,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        // envMapIntensity: 0,
        // envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/forklift.png"),
        alphaMap: textureLoader.load("Assets/texture/forklift_opacity.png"),
    });
    markerMaterial.blending = THREE['NormalBlending'];

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
        crystalMaterial.envMap = hdrCubeRenderTarget.texture;
        crystalMaterial.needsUpdate = true;
        hdrCubeMap.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
    });

    //Logo Model
    var logoModelSize = 0.1;
    new THREE.OBJLoader(manager).setPath('Assets/model/').load('logo.obj', function (object) {
        logoCrystal = object;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                var isMarker = child.name.includes("photo");
                child.material = isMarker ? markerMaterial : crystalMaterial;
                child.scale.set(logoModelSize, logoModelSize, logoModelSize);
                // if(isMarker)
                //     child.position.set(0,0,0);
            }
        });
        // scene.add(object);
        //Set animation
        // TweenMax.from(logoCrystal.rotation, 5, {x:40})
        // TweenMax.to(logoCrystal.scale, 5, { x: 1, y: 1, z: 1, x: 2, y: 2, z: 2, ease: Power2.easeInOut });
    });



    //Central Model
    centralModel = new THREE.Mesh(new THREE.SphereGeometry(0.001), new THREE.MeshPhysicalMaterial({
        opacity: 0,
        transparent: true,
    }));
    scene.add(centralModel);

    //Partial Model
    let largeCrystalSize = 0.5;
    let smallsCrystalSize = 1.1;
    let partialCrystalIdx = [];
    let largeCrystalPercent = 0.4;
    let largeCrystalEndIdx = Math.floor(partialCrystalCount * largeCrystalPercent);
    for (let i = 0; i < largeCrystalEndIdx; i++) {
        partialCrystalIdx.push(Math.floor(getRandomScale(1, 6)));
    }
    for (let i = largeCrystalEndIdx; i < partialCrystalCount; i++) {
        partialCrystalIdx.push(Math.floor(getRandomScale(7, 11)));
    }
    for (let i = 0; i < partialCrystalCount; i++) {
        new THREE.OBJLoader(manager).setPath('Assets/model/').load(partialCrystalIdx[i] + '.obj', function (object) {
            //Random point within sphere uniformly
            let radius = 50;
            let alpha = 2 * Math.PI * Math.random();
            let ua = getRandomScale(-1, 1) + getRandomScale(-1, 1);
            let ra = Math.abs(ua) < 0.8 ? 2 - Math.abs(ua) : ua;

            let rx = ra * Math.cos(alpha);
            rx = rx * radius;
            let ry = ra * Math.sin(alpha);
            ry = ry * radius;

            let beta = 2 * Math.PI * Math.random();
            let ub = getRandomScale(-1, 1) + getRandomScale(-1, 1);
            let rb = Math.abs(ub) < 0.8 ? 2 - Math.abs(ub) : ub;
            let rz = rb * Math.sin(beta);
            rz = rz * 60;
            let partialCrystal = object;
            partialCrystal.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    let isMarker = child.name.includes("photo");
                    child.material = isMarker ? markerMaterial : crystalMaterial;
                }
            });

            scene.add(partialCrystal);
            partialCrystal.position.set(rx, ry, rz);
            partialCrystal.scale.set(i < largeCrystalEndIdx ? largeCrystalSize : smallsCrystalSize, i < largeCrystalEndIdx ? largeCrystalSize : smallsCrystalSize, i < largeCrystalEndIdx ? largeCrystalSize : smallsCrystalSize);
            let pos = new THREE.Vector3(rx, ry, rz);
            initPositionOfPartialCrystals.push(pos);
            let r = distanceVector(new THREE.Vector3(0, 0, 0), pos);
            radiusPartialCrystals.push(r);
            partialCrystal.rotation.set(getRandomScale(-40, 40), getRandomScale(-40, 40), getRandomScale(-40, 40));

            partialCrystals.push(partialCrystal);

            let partialCrystalRoot = new THREE.Object3D();
            scene.add(partialCrystalRoot);
            partialCrystalRoot.add(partialCrystal);
            partialCrystalRoot.position.set(0, 0, 0);
            centralModel.add(partialCrystalRoot);
            partialCrystalRoots.push(partialCrystalRoot);

            //Rotate World Space
            let partialCrystalRootAngleSpeed = new THREE.Vector3(getRandomScale(-1, 1) * r / 50000, getRandomScale(-1, 1) * r / 50000, getRandomScale(-1, 1) * r / 50000);
            partialCrystalRootAngleSpeeds.push(partialCrystalRootAngleSpeed);

            //Rotate Local Space
            let partialCrystalAngleSpeed = new THREE.Vector3(getRandomScale(-1, 1) / 200, getRandomScale(-1, 1) / 200, getRandomScale(-1, 1) / 200);
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
    centralModelTimer = 0;
    targetRotationX = centralModel.rotation.y;
    event.preventDefault();
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationXOnMouseDown = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationYOnMouseDown = targetRotationY;
}
function onDocumentMouseMove(event) {
    console.log("mouse move");
    mouseX = event.clientX - windowHalfX;
    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

    mouseY = event.clientY - windowHalfY;
    targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
}
function onDocumentMouseUp() {
    isMouseDown = false;
}
function onDocumentMouseOut() {
    isMouseDown = false;
}
function onDocumentTouchStart(event) {
    isMouseDown = true;
    centralModelTimer = 0;
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationXOnMouseDown = targetRotationX;
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

        mouseY = event.clientY - windowHalfY;
        targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
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

function render() {

    var delta = 5 * clock.getDelta();
    animTimer += delta;
    //Initial Animation
    if (centralModel) {
        // centralModel.rotation.y += 0.003 * delta;
        for (let i = 0; i < partialCrystalCount; i++) {
            //Rotate local space
            if (partialCrystals[i]) {
                partialCrystals[i].rotation.x += partialCrystalAngleSpeeds[i].x;
                partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].y;
                partialCrystals[i].rotation.y += partialCrystalAngleSpeeds[i].z;
            }

            //Rotate world space
            if (partialCrystalRoots[i]) {
                partialCrystalRoots[i].rotation.x += partialCrystalRootAngleSpeeds[i].x;
                partialCrystalRoots[i].rotation.y += partialCrystalRootAngleSpeeds[i].y;
                partialCrystalRoots[i].rotation.z += partialCrystalRootAngleSpeeds[i].z;
            }
        }

    }

    switch (currentState) {
        case State.Laround:
            //Animation by mouse
            if (isMouseDown) {
                mouseDownTimer += delta;
                if (mouseDownTimer > State.times[currentState].value) {
                    currentState = State.Lgather;
                }
                centralModel.rotation.y += (targetRotationX - centralModel.rotation.y) * 0.008;
            }
            else {
                mouseDownTimer = 0;
                centralModelTimer += delta;
                if (centralModelTimer < 2) {
                    centralModel.rotation.y += (targetRotationX - centralModel.rotation.y) * (2 - centralModelTimer) * 0.002;
                }
                centralModel.rotation.x = (targetRotationY - centralModel.rotation.x) * 0.01;
            }
            break;

        case State.Lgather:

            break;
        case State.Saround:
            break;
        case State.Sgather:
            break;
        case State.Logo:
            break;
        default:
            break;
    }


    if (Math.abs(oldMouseX - mouseX) > 0 || Math.abs(oldMouseY - mouseY) > 0) {
        mouseDownTimer = 0;
    }
    oldMouseX = mouseX;
    oldMouseY = mouseY

    renderer.render(scene, camera);
    composer.render(0.01);
}
