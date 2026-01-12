// class AvattarManager {
// constructor(scene) {
//         this.scene = scene;
//         this.avatarRef = null;
//         this.mouseX = 0;
//         this.mouseY = 0;
//         this.time = 0;
        
//         window.addEventListener('mousemove', (e) => {
//             this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
//             this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
//         });
//     }

//     loadAvatar(url) {
//         if (this.avatarRef) {
//             this.scene.remove(this.avatarRef);
//         }

//         const loader = new THREE.GLTFLoader();
//         loader.load(
//             url,
//             (gltf) => {
//                 console.log('✓ Avatar loaded!');
//                 const model = gltf.scene;
//                 model.scale.set(1, 1, 1);
//                 model.position.set(0, 0.5, -1.5);
//                 model.traverse((child) => {
//                     if (child.isMesh) {
//                         child.castShadow = true;
//                         child.receiveShadow = true;
//                     }
//                 });
//                 this.scene.add(model);
//                 this.avatarRef = model;
//             },
//             (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
//             (error) => {
//                 console.error('Failed to load avatar:', error);
//                 this.createProceduralAvatar();
//             }
//         );
//     }

//     createProceduralAvatar() {
//         const avatar = new THREE.Group();
//         const skinColor = 0xfdbcb4;
//         const shirtColor = 0x3498db;
//         const hairColor = 0x2c1810;
        
//         const head = new THREE.Mesh(
//             new THREE.SphereGeometry(0.12, 32, 32),
//             new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.5, metalness: 0.1 })
//         );
//         head.scale.set(1, 1.2, 1);
//         head.position.y = 1.65;
//         head.castShadow = true;
//         avatar.add(head);
        
//         const hair = new THREE.Mesh(
//             new THREE.SphereGeometry(0.13, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6),
//             new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
//         );
//         hair.position.y = 1.72;
//         hair.castShadow = true;
//         avatar.add(hair);
        
//         const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
//         const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), eyeMat);
//         leftEye.position.set(-0.04, 1.67, 0.11);
//         avatar.add(leftEye);
        
//         const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), eyeMat);
//         rightEye.position.set(0.04, 1.67, 0.11);
//         avatar.add(rightEye);
        
//         const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1a472a });
//         const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.008, 16, 16), pupilMat);
//         leftPupil.position.set(-0.04, 1.67, 0.125);
//         avatar.add(leftPupil);
        
//         const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.008, 16, 16), pupilMat);
//         rightPupil.position.set(0.04, 1.67, 0.125);
//         avatar.add(rightPupil);
        
//         const nose = new THREE.Mesh(
//             new THREE.ConeGeometry(0.015, 0.04, 8),
//             new THREE.MeshStandardMaterial({ color: skinColor })
//         );
//         nose.position.set(0, 1.64, 0.12);
//         nose.rotation.x = Math.PI / 2;
//         avatar.add(nose);
        
//         const neck = new THREE.Mesh(
//             new THREE.CylinderGeometry(0.06, 0.07, 0.15, 16),
//             new THREE.MeshStandardMaterial({ color: skinColor })
//         );
//         neck.position.y = 1.5;
//         neck.castShadow = true;
//         avatar.add(neck);
        
//         const torso = new THREE.Mesh(
//             new THREE.CylinderGeometry(0.18, 0.22, 0.5, 16),
//             new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 })
//         );
//         torso.position.y = 1.15;
//         torso.castShadow = true;
//         avatar.add(torso);
        
//         const shoulderGeo = new THREE.SphereGeometry(0.09, 16, 16);
//         const leftShoulder = new THREE.Mesh(shoulderGeo, new THREE.MeshStandardMaterial({ color: shirtColor }));
//         leftShoulder.position.set(-0.22, 1.35, 0);
//         leftShoulder.castShadow = true;
//         avatar.add(leftShoulder);
        
//         const rightShoulder = new THREE.Mesh(shoulderGeo, new THREE.MeshStandardMaterial({ color: shirtColor }));
//         rightShoulder.position.set(0.22, 1.35, 0);
//         rightShoulder.castShadow = true;
//         avatar.add(rightShoulder);
        
//         const armGeo = new THREE.CylinderGeometry(0.04, 0.038, 0.35, 16);
//         const leftArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: shirtColor }));
//         leftArm.position.set(-0.26, 1.1, 0);
//         leftArm.rotation.z = 0.2;
//         leftArm.castShadow = true;
//         avatar.add(leftArm);
        
//         const rightArm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: shirtColor }));
//         rightArm.position.set(0.26, 1.1, 0);
//         rightArm.rotation.z = -0.2;
//         rightArm.castShadow = true;
//         avatar.add(rightArm);
        
//         const handGeo = new THREE.SphereGeometry(0.04, 16, 16);
//         const handMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
//         const leftHand = new THREE.Mesh(handGeo, handMat);
//         leftHand.position.set(-0.32, 0.85, 0.2);
//         leftHand.castShadow = true;
//         avatar.add(leftHand);
        
//         const rightHand = new THREE.Mesh(handGeo, handMat);
//         rightHand.position.set(0.32, 0.85, 0.2);
//         rightHand.castShadow = true;
//         avatar.add(rightHand);
        
//         avatar.position.set(0, 0.5, -1.5);
//         this.scene.add(avatar);
//         this.avatarRef = avatar;
//     }

//     update(deltaTime) {
//         if (this.avatarRef) {
//             this.time += deltaTime;
//             const breathe = Math.sin(this.time * 1.5) * 0.008;
//             this.avatarRef.position.y = 0.5 + breathe;
//             this.avatarRef.rotation.y = this.mouseX * 0.05;
//             this.avatarRef.rotation.x = this.mouseY * 0.03;
//         }
//     }
// }