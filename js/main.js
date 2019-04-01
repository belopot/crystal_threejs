if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var container;
var camera, scene, renderer, composer, clock;
var uniforms, centralCrystal, logoCrystal;
var crystalMaterial, markerMaterial;
var hdrCubeRenderTarget;
var partialCrystals = [];

var params = {
    projection: 'normal',
    autoRotate: true,
    reflectivity: 1.0,
    background: false,
    exposure: 1.0,
    gemColor: 'Green'
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
    scene.background = new THREE.Color(0x0015ff);
    //////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Renderer
    //////////////////////////////////////////////////////////////////////////////////////////////
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setClearColor(0x000000, 0);
    //////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Camera
    //////////////////////////////////////////////////////////////////////////////////////////////
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 3000);
    camera.position.z = 105;
    camera.position.y = 10;
    scene.add(camera);
    //////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////
    //Light
    //////////////////////////////////////////////////////////////////////////////////////////////
    var intensity = 10.5;
    ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 30, -1);
    scene.add(directionalLight);

    var pointLight1 = new THREE.PointLight(0xffffff);
    pointLight1.position.set(30, 10, 0);
    pointLight1.intensity = intensity;
    pointLight1.castShadow = false;
    scene.add(pointLight1);
    var pointLight2 = new THREE.PointLight(0xffffff);
    pointLight2.position.set(-30, 0, 0);
    pointLight2.intensity = intensity;
    scene.add(pointLight2);
    var pointLight3 = new THREE.PointLight(0xffffff);
    pointLight3.position.set(0, -10, -30);
    pointLight3.intensity = intensity;
    scene.add(pointLight3);
    var pointLight4 = new THREE.PointLight(0xffffff);
    pointLight4.position.set(0, 0, 40);
    pointLight4.intensity = intensity;
    scene.add(pointLight4);
    //////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////
    //Clock
    //////////////////////////////////////////////////////////////////////////////////////////////
    clock = new THREE.Clock();
    //////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Effects
    /////////////////////////////////////////////////////////////////////////////////////////////
    var renderModel = new THREE.RenderPass(scene, camera);
    var effectBloom = new THREE.BloomPass(1.6);
    var effectFilm = new THREE.FilmPass(0.1, 0.1, 2048, false);
    effectFilm.renderToScreen = true;

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);
    /////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Camera Controller
    /////////////////////////////////////////////////////////////////////////////////////////////
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enablePan = false;
    controls.enableKeys = false;
    controls.enableZoom = false;
    /////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Import model
    /////////////////////////////////////////////////////////////////////////////////////////////
    var manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onLoad = function () {

        console.log('Loading complete!');

    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onError = function (url) {

        console.log('There was an error loading ' + url);

    };

    var textureLoader = new THREE.TextureLoader(manager);
    uniforms = {
        "fogDensity": { value: 0.45 },
        "fogColor": { value: new THREE.Vector3(0, 0, 0) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2(3.0, 1.0) },
        "texture1": { value: textureLoader.load('Assets/texture/opacity.png') },
        "texture2": { value: textureLoader.load('Assets/texture/diffuse.png') }
    };
    uniforms["texture1"].value.wrapS = uniforms["texture1"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms["texture2"].value.wrapT = THREE.RepeatWrapping;
    var matShader = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });

    //Crystal Material
    crystalMaterial = new THREE.MeshPhysicalMaterial({
        // color: 0x0000ff,
        // emissive: 0x000001,
        roughness: 0.1,
        metalness: 1.0,
        reflectivity: 0.9,
        refractionRatio: 0.5,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        envMapIntensity: 0.3,
        envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/diffuse.png"),
        alphaMap: textureLoader.load("Assets/texture/opacity.png"),
        specularMap: textureLoader.load("Assets/texture/glossiness.png"),
        lightMap: textureLoader.load("Assets/texture/glossiness.png"),
        normalMap: textureLoader.load("Assets/texture/normal.png"),
        normalScale: new THREE.Vector2(1, 1),
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
        envMapIntensity: 0,
        envMaps: textureLoader.load("Assets/texture/env.jpg"),
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


    //Large Model
    var centralModelSize = 1;
    new THREE.OBJLoader(manager).setPath('Assets/model/').load('1.obj', function (object) {
        centralCrystal = object;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                var isMarker = child.name.includes("photo");
                child.material = isMarker ? markerMaterial : crystalMaterial;
                child.scale.set(centralModelSize, centralModelSize, centralModelSize);
                // if(isMarker)
                //     child.position.set(0,0,0);
            }
        });
        scene.add(object);
        //Set animation
        // TweenMax.from(centralCrystal.rotation, 5, {x:40})
        // TweenMax.to(centralCrystal.scale, 5, { x: 1, y: 1, z: 1, x: 2, y: 2, z: 2, ease: Power2.easeInOut });
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
    }

    ///////////////////////////////////
    //Partial Model
    var partialModelSize = 0.7;
    var partialModelPos = [
        new THREE.Vector3(-42.5, -1.53, -1.57),
        new THREE.Vector3(-19.966, 2.39, 16.16),
        new THREE.Vector3(2.51, 2.97, 37.12),
        new THREE.Vector3(40.58, 1.36, -1.57),
        new THREE.Vector3(2.51, -3.45, -37.99),
        new THREE.Vector3(-23.04, 3.54, -15.07),
        new THREE.Vector3(-7.15, -2.20, -16.22),
        new THREE.Vector3(15.56, 3.38, 9.51),
        new THREE.Vector3(24.08, -2.88, 24.32),
        new THREE.Vector3(19.59, 1.33, -23.76),
    ];
    var partialModelIdx = 0;
    for (var i = 0; i < partialModelPos.length; i++) {
        new THREE.OBJLoader(manager).setPath('Assets/model/').load((i+2) + '.obj', function (object) {
            var partialCrystal = object;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var isMarker = child.name.includes("photo");
                    child.material = isMarker ? markerMaterial : crystalMaterial;
                    child.scale.set(partialModelSize, partialModelSize, partialModelSize);
                    child.position.set(0, 0, 0);
                }
            });
            scene.add(object);
            var rx = partialModelPos[partialModelIdx].x;
            var ry = partialModelPos[partialModelIdx].y;
            var rz = partialModelPos[partialModelIdx].z;
            TweenMax.to(partialCrystal.position, 1.5, { x: 0, y: 0, z: 0, x: rx, y: ry, z: rz, ease: Power4.easeInOut });
            centralCrystal.add(partialCrystal);
            partialCrystals.push(partialCrystal);
            partialModelIdx++;
        });
    }


    /////////////////////////////////////////////////////////////////////////////////////////////

    onWindowResize();

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Event
    /////////////////////////////////////////////////////////////////////////////////////////////
    window.addEventListener('resize', onWindowResize, false);
    /////////////////////////////////////////////////////////////////////////////////////////////
}

function onWindowResize() {
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
    // if (crystalMaterial !== undefined && markerMaterial !== undefined) {
    //     markerMaterial.reflectivity = crystalMaterial.reflectivity = params.reflectivity;
    //     var newColor = crystalMaterial.color;
    //     switch (params.gemColor) {
    //         case 'Blue': newColor = new THREE.Color(0x000088); break;
    //         case 'Red': newColor = new THREE.Color(0x880000); break;
    //         case 'Green': newColor = new THREE.Color(0x008800); break;
    //         case 'White': newColor = new THREE.Color(0x888888); break;
    //         case 'Black': newColor = new THREE.Color(0x0f0f0f); break;
    //     }
    //     crystalMaterial.color = markerMaterial.color = newColor;
    // }
    renderer.toneMappingExposure = params.exposure;
    camera.lookAt(scene.position);

    var delta = 5 * clock.getDelta();
    uniforms["time"].value += 0.2 * delta;
    if (centralCrystal) {
        centralCrystal.rotation.y += 0.035 * delta;
        // logoCrystal.rotation.y += 0.035 * delta;
    }
    renderer.clear();
    composer.render(0.01);
}
