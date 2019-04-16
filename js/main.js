var container;
var camera, cameraRoot, scene, renderer, composer, clock;
var crystalMaterial, markerMaterial;
var hdrCubeRenderTarget;
var logoCrystal;
var partialCrystals = [];
var partialCrystalRoots = [];
var partialCrystalRootAngleSpeeds = [];
var partialCrystalAngleSpeeds = [];
var initPositionOfPartialCrystals = [];
var initScaleOfPartialCrystals = [];
var originPartCrystalPos = [];
var crystalParent;
var partialCrystalCount = 110;


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


//Gather mesh
var downTimer = 0;
var gatherTimer = 0;

var State = {
    Laround: 1,
    Lgather: 2,
    Saround: 3,
    Sgather: 4,
    Logo: 5,
    End: 6,
    times: {
        1: { value: 0 },
        2: { value: 13.0 },
        3: { value: 6.6 },
        4: { value: 5 },
        5: { value: 5 },
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
    return (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5
}


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
    camera.position.z = 135;
    camera.position.y = -2;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraRoot = new THREE.Object3D();
    cameraRoot.add(camera);
    scene.add(cameraRoot);

    //////////////////////////////////////////////////////////////////////////////////////////////
    //Light
    //////////////////////////////////////////////////////////////////////////////////////////////
    ambientLight = new THREE.AmbientLight(0x0000ff);
    ambientLight.intensity = 100;
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 30, -1);
    scene.add(directionalLight);

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
        // emissive: 0x000011,
        roughness: 0.005,
        metalness: 0.8,
        reflectivity: 0.5,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true,
        mapping: THREE.CubeRefractionMapping,
        envMapIntensity: 3.3,
        envMaps: textureLoader.load("Assets/texture/env.jpg"),
        premultipliedAlpha: true,
        map: textureLoader.load("Assets/texture/diffuse.png"),
        alphaMap: textureLoader.load("Assets/texture/opacity.png"),
        specularMap: textureLoader.load("Assets/texture/glossiness.png"),
        lightMap: textureLoader.load("Assets/texture/glossiness.png"),
        normalMap: textureLoader.load("Assets/texture/normal.png"),
        normalScale: new THREE.Vector2(1.7, 1.7),
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
    new THREE.OBJLoader(manager).setPath('Assets/model/').load('logo.obj', function (object) {
        logoCrystal = object;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = crystalMaterial;
                child.scale.set(0.15, 0.15, 0.15);
            }
        });
        logoCrystal.visible = false;
        logoCrystal.scale.set(0.3, 0.3, 0.3);
        crystalParent.add(logoCrystal);
    });

    //Partial Model
    crystalParent = new THREE.Object3D()
    let largeCrystalSize = 0.3;
    let smallsCrystalSize = 0.7;
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

            partialCrystal.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    let isMarker = child.name.includes("photo");
                    child.material = isMarker ? markerMaterial : crystalMaterial;
                    if (isMarker) {
                        child.visible = false;
                    }
                }
            });

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

function render() {

    var delta = 5 * clock.getDelta();

    //Logo Crystal Animation
    if(logoCrystal && currentState == State.End){
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
                let a = Math.exp(gatherTimer * 0.08) * 0.003;
                if (a > 0.017) {
                    a = 0.02;
                }
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
                        let rx = initPositionOfPartialCrystals[idx].x * 0.4;
                        let ry = initPositionOfPartialCrystals[idx].y * 0.4;
                        let rz = initPositionOfPartialCrystals[idx].z * 0.4;
                        let sx = initScaleOfPartialCrystals[idx].x * 0.8;
                        let sy = initScaleOfPartialCrystals[idx].y * 0.8;
                        let sz = initScaleOfPartialCrystals[idx].z * 0.8;
                        TweenMax.killTweensOf(partCrystal);
                        TweenMax.to(partCrystal.position, 2.5, {
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
                        TweenMax.to(partCrystal.scale, 2.5, {
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
                gatherTimer += delta;
                if (downTimer > State.times[currentState].value) {
                    currentState = State.Saround;
                    downTimer = 0;
                }
            }
            else {
                //Return origin position
                currentState = State.Laround;
                downTimer = 0;
                gatherTimer = 0;
                let idx = 0;
                partialCrystals.forEach(partCrystal => {
                    TweenMax.killTweensOf(partCrystal);
                    TweenMax.to(partCrystal.position, 2.5, {
                        x: initPositionOfPartialCrystals[idx].x,
                        y: initPositionOfPartialCrystals[idx].y,
                        z: initPositionOfPartialCrystals[idx].z,
                        ease: Expo.easeOut
                    });
                    TweenMax.to(partCrystal.scale, 2.5, {
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
                    idx++;
                });
            }
            break;
        case State.Saround:
            downTimer += delta;
            gatherTimer += delta;
            if (downTimer > State.times[currentState].value) {
                currentState = State.Sgather;
                downTimer = 0;
            }
            break;
        case State.Sgather:
            downTimer += delta;
            gatherTimer += delta;
            if (downTimer > State.times[currentState].value) {
                currentState = State.Logo;
                downTimer = 0;
                //Anim Sgather
                partialCrystals.forEach(partCrystal => {
                    //Random point within sphere uniformly
                    TweenMax.killTweensOf(partCrystal);
                    TweenMax.to(partCrystal.position, 2, {
                        ease: Expo.easeOut,
                        x: 0,
                        y: 0,
                        z: 0,
                        onComplete() {
                        },
                        onUpdate() {
                        }
                    });
                });
            }
            break;
        case State.Logo:
            //Hide partialCrystals
            downTimer += delta;
            gatherTimer += delta;
            if (downTimer > State.times[currentState].value) {
                //Logo
                currentState = State.End;
                downTimer = 0;

                logoCrystal.visible = true;
                TweenMax.killTweensOf(logoCrystal);
                TweenMax.to(logoCrystal.scale, 2, {
                    ease: Power3.easeOut,
                    x: 1,
                    y: 1,
                    z: 1,
                    onComplete() {
                        // currentState = State.Saround;
                        partialCrystals.forEach(partCrystal => {
                            TweenMax.killTweensOf(partCrystal);
                            partCrystal.visible = false;
                            gatherTimer = 0;
                        })
                    },
                    onUpdate() {

                    }
                });
            }
            break;
        case State.End:

            break;
        default:
            break;
    }

    renderer.render(scene, camera);
    // composer.render(0.01);
}
