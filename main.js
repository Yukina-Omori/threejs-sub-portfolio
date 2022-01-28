import * as THREE from "three";
import { Mesh } from "three";

//キャンバスの取得
const canvas = document.querySelector(".webgl");

// 必須の三要素を入れよう
// scene
const scene = new THREE.Scene();
// camera + sizes も予め指定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
// cameraの中には色々なデータが入っていて、その中のpositionを設定している
scene.add(camera);

//renderer(canvasを指定する)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトの作成
const material = new THREE.MeshBasicMaterial({
  color: "white",
  wireframe:true,
});
const materialColor = new THREE.MeshBasicMaterial({
  color: "gray",
  wireframe:true,
  opacity:0.1,
});


const mesh1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 8), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(2, 5), material);
const mesh3 = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 3), material);
const mesh4 = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 16), materialColor);
//配置
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(2, 0, 3);
//全部のオブジェクトを配列に入れる（そうするとfor文で１つ１つ取り出せる）
const meshes = [mesh1, mesh2, mesh3, mesh4];
scene.add(mesh1, mesh2, mesh3, mesh4);

//パーティクル
const particleGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const positionArray = new Float32Array(particlesCount * 3);

//テクスチャ設定
// const textureLoader = new THREE.TextureLoader();
// const particlesTexture = textureLoader.load('./particleImage.png');

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 30; //*10にして画面いっぱいにしている
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  color: "white",
  // alphaMap: particlesTexture,
});
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

//ライトの作成
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

//ブラウザのりサイズ操作(★雛形として使える部分）
window.addEventListener("resize", () => {
  //幅高さの更新
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//ホイールを実装してみる
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (event) => {
  speed += event.deltaY * 0.0002;
});

//ホイールで動かすために新しい関数を作る
function rot() {
  rotation += speed; //なめらかな動きになる
  speed *= 0.93; //慣性がつく

  //ジオメトリ全体を回転させる（3.8がr（半径）に当てはまる）（原点のx軸が2、zが-3、底を中心に回ってるという意味）
  //rotationがθに相当する
  // Math.PI /2 = 90度　ずつズラしている
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  window.requestAnimationFrame(rot);
}
rot();

//カーソルの位置を取得してみよう
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5; // 数字が大きいので画面幅で割って0~1で正規化する。-0.5で中央を0にする
  cursor.y = event.clientY / sizes.height - 0.5; // 0~1で正規化する。-0.5で中央を0にする
});

//アニメーション(毎秒ごとにセットする：最後に出力するrenderもここにいれる)
const clock = new THREE.Clock(); //時間追跡
const animate = () => {
  renderer.render(scene, camera);
  //PCごとのフレーム時間を統一する
  let getDeltaTime = clock.getDelta();

  //meshを回転させる
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.1 * getDeltaTime;
  }
  //カメラの制御する
  camera.position.x += cursor.x * getDeltaTime * 0.5;
  camera.position.y += cursor.y * getDeltaTime * 0.5;
  camera.lookAt(mesh3.position);
  //フレーム（0.01秒）ごとに実行している（最後にかならずいる）
  window.requestAnimationFrame(animate);
};
animate();


//パーツ
window.addEventListener ('DOMContentLoaded', ()=>{
  const btn = document.querySelector('.btn-show');
  const module = document.querySelector('.module');
  const closeBtn = document.querySelector('.btn-close');
  
  btn.addEventListener("click", () =>{
   module.classList.remove('hidden');
  });
  closeBtn.addEventListener("click", () =>{
      module.classList.add('hidden');
     });
});
