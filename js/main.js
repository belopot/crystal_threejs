if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var container;
var camera, scene, renderer, composer, clock;
var uniforms, crystal;
var crystalMaterial, markerMaterial;
var hdrCubeRenderTarget;

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
    scene.background = new THREE.Color(0x000b1b);
    //////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Camera
    //////////////////////////////////////////////////////////////////////////////////////////////
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 3000);
    camera.position.z = 65;
    scene.add(camera);
    //////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////
    //Light
    //////////////////////////////////////////////////////////////////////////////////////////////
    var intensity = 1.5;
    ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 10, - 1);
    scene.add(directionalLight);

    var pointLight1 = new THREE.PointLight(0x0008ff);
    pointLight1.position.set(40, 10, 0);
    pointLight1.intensity = intensity;
    pointLight1.castShadow = false;
    scene.add(pointLight1);
    var pointLight2 = new THREE.PointLight(0x0800ff);
    pointLight2.position.set(- 40, 0, 0);
    pointLight2.intensity = intensity;
    scene.add(pointLight2);
    var pointLight3 = new THREE.PointLight(0x0808ff);
    pointLight3.position.set(0, - 10, - 40);
    pointLight3.intensity = intensity;
    scene.add(pointLight3);
    // var pointLight4 = new THREE.PointLight(0xffffff);
    // pointLight4.position.set(0, 0, 40);
    // pointLight4.intensity = intensity;
    // scene.add(pointLight4);
    //////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////
    //Clock
    //////////////////////////////////////////////////////////////////////////////////////////////
    clock = new THREE.Clock();
    //////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Renderer
    //////////////////////////////////////////////////////////////////////////////////////////////
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    //////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    //Effects
    /////////////////////////////////////////////////////////////////////////////////////////////
    var renderModel = new THREE.RenderPass(scene, camera);
    var effectBloom = new THREE.BloomPass(1.5);
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
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var textureLoader = new THREE.TextureLoader();
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
    var material1 = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });


    crystalMaterial = new THREE.MeshPhysicalMaterial({
        // color: 0x0000ff,
        emissive: 0x000011,
        roughness: 0.1,
        metalness: 1.0,
        reflectivity: 0.4,
        refractionRatio: 0.9,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping : THREE.CubeRefractionMapping,
        envMapIntensity: 1.2,
        envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/diffuse.png"),
        alphaMap: textureLoader.load("Assets/texture/opacity.png"),
        specularMap: textureLoader.load("Assets/texture/glossiness.png"),
        lightMap: textureLoader.load("Assets/texture/glossiness.png"),
        normalMap: textureLoader.load("Assets/texture/normal.png"),
        normalScale: new THREE.Vector2(0.8, 0.8)
    });


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
        mapping : THREE.CubeRefractionMapping,
        envMapIntensity: 0,
        envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/forklift.png"),
        alphaMap: textureLoader.load("Assets/texture/forklift_opacity.png"),
    });
    markerMaterial.blending = THREE[ 'NormalBlending' ];

    var genCubeUrls = function (prefix, postfix) {
        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];
    };

    var hdrUrls = genCubeUrls("Assets/texture/", ".hdr");
    new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, function (hdrCubeMap) {
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


    new THREE.OBJLoader().setPath('Assets/model/').load('5.obj', function (object) {
        crystal = object;
        object.traverse(function (child) {
            if ( child instanceof THREE.Mesh ) {
                var isMarker = child.name.includes("photo");
                child.material = isMarker ? markerMaterial : crystalMaterial;
                if(isMarker)
                    child.position.set(0,0,0);
            }
        });
        scene.add(object);  
    });

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
    camera.lookAt( scene.position );

    var delta = 5 * clock.getDelta();
    uniforms["time"].value += 0.2 * delta;
    if (crystal) {
        crystal.rotation.y += 0.075 * delta;
    }
    renderer.clear();
    composer.render(0.01);
}
