import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/_color.png')
colorTexture.colorSpace = THREE.SRGBColorSpace
const heightTexture = textureLoader.load('/textures/door/_height.png')
const normalTexture = textureLoader.load('/textures/door/_normal.png')
const ambientOcclusionTexture = textureLoader.load('/textures/door/_ambientOcclusion.png')
const metalnessTexture = textureLoader.load('/textures/door/_metalness.png')
const roughnessTexture = textureLoader.load('/textures/door/_roughness.png')

colorTexture.generateMipmaps = false
colorTexture.magFilter = THREE.NearestFilter

colorTexture.repeat.set(2, 2)
normalTexture.repeat.set(2, 2)
heightTexture.repeat.set(2, 2)
ambientOcclusionTexture.repeat.set(2, 2)
metalnessTexture.repeat.set(2, 2)
roughnessTexture.repeat.set(2, 2)

colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
normalTexture.wrapS = THREE.RepeatWrapping
normalTexture.wrapT = THREE.RepeatWrapping
heightTexture.wrapS = THREE.RepeatWrapping
heightTexture.wrapT = THREE.RepeatWrapping
ambientOcclusionTexture.wrapS = THREE.RepeatWrapping
ambientOcclusionTexture.wrapT = THREE.RepeatWrapping
metalnessTexture.wrapS = THREE.RepeatWrapping
metalnessTexture.wrapT = THREE.RepeatWrapping
roughnessTexture.wrapS = THREE.RepeatWrapping
roughnessTexture.wrapT = THREE.RepeatWrapping

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const geometry = new THREE.TorusGeometry(2, 0.2, 160, 320)
const material = new THREE.MeshStandardMaterial({ 
    map: colorTexture,
    normalMap: normalTexture,
    displacementMap: heightTexture,
    aoMap: ambientOcclusionTexture,
    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture,
})
geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))
const mesh = new THREE.Mesh(geometry, material)
mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 8)
directionalLight.position.set(3, -5, 3)
directionalLight.castShadow = true
scene.add(directionalLight)

const pointLight = new THREE.PointLight("#666", 200, 200)
pointLight.position.set(-10, -10, 10)
scene.add(pointLight)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()