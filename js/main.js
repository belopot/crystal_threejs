if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var container;
var camera, scene, renderer, composer, clock;
var uniforms, obj;
init();
animate();
function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 3000);
    camera.position.z = 65;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x006bff);

    // //
    // var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    // scene.add(ambientLight);
    // var pointLight = new THREE.PointLight(0xffffff, 0.8);
    // camera.add(pointLight);
    // scene.add(camera);
    // //

    clock = new THREE.Clock();
    var textureLoader = new THREE.TextureLoader();
    uniforms = {
        "fogDensity": { value: 0.45 },
        "fogColor": { value: new THREE.Vector3(0.5, 0.5, 0.5) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2(3.0, 1.0) },
        "texture1": { value: textureLoader.load('Assets/objs/crystal/bump.jpg') },
        "texture2": { value: textureLoader.load('Assets/objs/crystal/specular.jpg') },
        "texture3": { value: textureLoader.load('Assets/objs/crystal/cloud.png') },
        "texture4": { value: textureLoader.load('Assets/objs/crystal/lavatile.jpg') }
    };
    uniforms["texture1"].value.wrapS = uniforms["texture1"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms["texture2"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture3"].value.wrapS = uniforms["texture3"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture3"].value.wrapS = uniforms["texture3"].value.wrapT = THREE.RepeatWrapping;

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });

    new THREE.OBJLoader()
        .setPath('Assets/objs/crystal/')
        .load('1.obj', function (object) {
            obj = object;
            obj.traverse(function (child) {
                if (child.isMesh) child.material = material;
            });
            obj.rotation.x = 0.3;
            scene.add(obj);
        });

    //
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;
    //
    var renderModel = new THREE.RenderPass(scene, camera);
    var effectBloom = new THREE.BloomPass(0);
    var effectFilm = new THREE.FilmPass(0.1, 0.1, 2048, false);
    effectFilm.renderToScreen = true;
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);
    //
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.reset();
}
//
function animate() {
    requestAnimationFrame(animate);
    render();
}
function render() {
    var delta = 5 * clock.getDelta();
    uniforms["time"].value += 0.2 * delta;
    if (obj)
        obj.rotation.y += 0.075 * delta;
    renderer.clear();
    composer.render(0.01);
}