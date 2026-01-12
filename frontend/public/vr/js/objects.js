// Room and Objects Creation
class RoomBuilder {
    constructor(scene) {
        this.scene = scene;
    }

    createRoom() {
        this.createFloor();
        this.createWalls();
        this.createCeiling();
        this.createDesk();
        this.createChairs();
        //this.createInterviewer();
        this.createBookshelf();
        this.createWindow();
        this.createPlant();
        this.createLaptop();
        this.createPictures();
    }

    createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b7355,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe8dcc0,
            roughness: 0.9,
            metalness: 0.1
        });

        // Back wall
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallMaterial);
        backWall.position.set(0, 2.5, -10);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallMaterial);
        leftWall.position.set(-10, 2.5, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), wallMaterial);
        rightWall.position.set(10, 2.5, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
    }

    createCeiling() {
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        ceiling.position.y = 5;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);
    }

    createDesk() {
        const deskMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5c4033,
            roughness: 0.3,
            metalness: 0.2
        });

        // Desk top
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.1, 1.5),
            deskMaterial
        );
        desk.position.set(0, 0.75, 0);
        desk.castShadow = true;
        desk.receiveShadow = true;
        this.scene.add(desk);

        // Desk legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3e2a1f });
        
        const positions = [
            [-1.3, 0.35, -0.6],
            [1.3, 0.35, -0.6],
            [-1.3, 0.35, 0.6],
            [1.3, 0.35, 0.6]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });
    }

    createChairs() {
        this.createChair(0, 0, -0.5, 0);
        this.createChair(0, 0, 0.8, Math.PI,true);
    }

    createChair(x, y, z, rotation) {
        const group = new THREE.Group();
        
        // Seat
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.1, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
        );
        seat.position.y = 0.5;
        seat.castShadow = true;
        group.add(seat);

        // Back
        const back = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.8, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
        );
        back.position.set(0, 0.9, -0.25);
        back.castShadow = true;
        group.add(back);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        
        [-0.2, 0.2].forEach(xOff => {
            [-0.2, 0.2].forEach(zOff => {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(xOff, 0.25, zOff);
                leg.castShadow = true;
                group.add(leg);
            });
        });

        group.position.set(x, y, z);
        group.rotation.y = rotation;
        this.scene.add(group);
    }

    createBookshelf() {
        const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        
        // Frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2, 3, 0.4),
            shelfMaterial
        );
        frame.position.set(-8, 1.5, -8);
        frame.castShadow = true;
        this.scene.add(frame);

        // Shelves and books
        for (let i = 0; i < 4; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(1.9, 0.05, 0.35),
                shelfMaterial
            );
            shelf.position.set(-8, 0.5 + i * 0.7, -8);
            shelf.castShadow = true;
            this.scene.add(shelf);

            // Books
            for (let j = 0; j < 5; j++) {
                const book = new THREE.Mesh(
                    new THREE.BoxGeometry(0.15, 0.2, 0.3),
                    new THREE.MeshStandardMaterial({ 
                        color: Math.random() * 0xffffff 
                    })
                );
                book.position.set(
                    -8.8 + j * 0.35,
                    0.65 + i * 0.7,
                    -8
                );
                book.castShadow = true;
                this.scene.add(book);
            }
        }
    }

    createWindow() {
        // Window frame
        const windowFrame = new THREE.Mesh(
            new THREE.BoxGeometry(3, 2.5, 0.1),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        windowFrame.position.set(-5, 2.5, -9.95);
        this.scene.add(windowFrame);

        // Window glass
        const windowGlass = new THREE.Mesh(
            new THREE.PlaneGeometry(2.7, 2.2),
            new THREE.MeshStandardMaterial({ 
                color: 0x87ceeb,
                transparent: true,
                opacity: 0.3,
                metalness: 0.9,
                roughness: 0.1
            })
        );
        windowGlass.position.set(-5, 2.5, -9.9);
        this.scene.add(windowGlass);
    }

    createPlant() {
        // Pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16),
            new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        pot.position.set(7, 0.15, -7);
        pot.castShadow = true;
        this.scene.add(pot);

        // Plant leaves
        const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        for (let i = 0; i < 8; i++) {
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 8, 8),
                leafMaterial
            );
            const angle = (i / 8) * Math.PI * 2;
            leaf.position.set(
                7 + Math.cos(angle) * 0.2,
                0.4 + Math.random() * 0.3,
                -7 + Math.sin(angle) * 0.2
            );
            leaf.castShadow = true;
            this.scene.add(leaf);
        }
    }

     createLaptop() {
        // Laptop base (on interviewer's side)
        const laptopBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.02, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        laptopBase.position.set(0, 0.81, -0.4);
        laptopBase.castShadow = true;
        this.scene.add(laptopBase);

        // Laptop screen (facing you)
        const laptopScreen = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.3, 0.02),
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
        );
        laptopScreen.position.set(0, 0.96, -0.25);
        laptopScreen.rotation.x = 0.3;
        laptopScreen.castShadow = true;
        this.scene.add(laptopScreen);

        // Add notebook on your side
        const notebook = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.01, 0.35),
            new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
        );
        notebook.position.set(-0.5, 0.81, 0.3);
        notebook.castShadow = true;
        this.scene.add(notebook);

        // Add pen next to notebook
        const pen = new THREE.Mesh(
            new THREE.CylinderGeometry(0.008, 0.008, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0x1a4d8f })
        );
        pen.position.set(-0.3, 0.82, 0.3);
        pen.rotation.z = Math.PI / 2;
        pen.castShadow = true;
        this.scene.add(pen);

        // Add coffee mug on your side
        const mug = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.035, 0.08, 16),
            new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        mug.position.set(0.6, 0.85, 0.4);
        mug.castShadow = true;
        this.scene.add(mug);

        // Add papers on interviewer's side
        const papers = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.01, 0.4),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        papers.position.set(0.4, 0.81, -0.4);
        papers.castShadow = true;
        this.scene.add(papers);
    }


    createPictures() {
        // Picture frame on wall
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.7, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        frame.position.set(3, 2.5, -9.95);
        this.scene.add(frame);

        const picture = new THREE.Mesh(
            new THREE.PlaneGeometry(0.9, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x4a90e2 })
        );
        picture.position.set(3, 2.5, -9.9);
        this.scene.add(picture);
    }

    //  createInterviewer() {
    //     const interviewer = new THREE.Group();
        
    //     // Skin color
    //     const skinColor = 0xffdbac;
    //     const shirtColor = 0x1a4d8f;
    //     const pantColor = 0x2c2c2c;
    //     const hairColor = 0x3d2817;

    //     // Head
    //     const head = new THREE.Mesh(
    //         new THREE.SphereGeometry(0.15, 32, 32),
    //         new THREE.MeshStandardMaterial({ color: skinColor })
    //     );
    //     head.position.set(0, 1.5, 0);
    //     head.castShadow = true;
    //     interviewer.add(head);

    //     // Hair
    //     const hair = new THREE.Mesh(
    //         new THREE.SphereGeometry(0.16, 32, 32),
    //         new THREE.MeshStandardMaterial({ color: hairColor })
    //     );
    //     hair.position.set(0, 1.55, 0);
    //     hair.scale.set(1, 0.6, 1);
    //     hair.castShadow = true;
    //     interviewer.add(hair);

    //     // Eyes
    //     const eyeGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    //     const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        
    //     const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    //     leftEye.position.set(-0.05, 1.52, 0.13);
    //     interviewer.add(leftEye);
        
    //     const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    //     rightEye.position.set(0.05, 1.52, 0.13);
    //     interviewer.add(rightEye);

    //     // Nose
    //     const nose = new THREE.Mesh(
    //         new THREE.ConeGeometry(0.02, 0.05, 8),
    //         new THREE.MeshStandardMaterial({ color: skinColor })
    //     );
    //     nose.position.set(0, 1.48, 0.15);
    //     nose.rotation.x = Math.PI / 2;
    //     interviewer.add(nose);

    //     // Smile
    //     const smileGeometry = new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI);
    //     const smileMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    //     const smile = new THREE.Mesh(smileGeometry, smileMaterial);
    //     smile.position.set(0, 1.42, 0.14);
    //     smile.rotation.set(0.3, 0, 0);
    //     interviewer.add(smile);

    //     // Neck
    //     const neck = new THREE.Mesh(
    //         new THREE.CylinderGeometry(0.05, 0.06, 0.08, 16),
    //         new THREE.MeshStandardMaterial({ color: skinColor })
    //     );
    //     neck.position.set(0, 1.31, 0);
    //     neck.castShadow = true;
    //     interviewer.add(neck);

    //     // Torso (shirt)
    //     const torso = new THREE.Mesh(
    //         new THREE.BoxGeometry(0.35, 0.5, 0.2),
    //         new THREE.MeshStandardMaterial({ color: shirtColor })
    //     );
    //     torso.position.set(0, 1.0, 0);
    //     torso.castShadow = true;
    //     interviewer.add(torso);

    //     // Collar
    //     const collarLeft = new THREE.Mesh(
    //         new THREE.BoxGeometry(0.08, 0.15, 0.02),
    //         new THREE.MeshStandardMaterial({ color: 0xffffff })
    //     );
    //     collarLeft.position.set(-0.06, 1.2, 0.11);
    //     collarLeft.rotation.z = -0.3;
    //     interviewer.add(collarLeft);

    //     const collarRight = new THREE.Mesh(
    //         new THREE.BoxGeometry(0.08, 0.15, 0.02),
    //         new THREE.MeshStandardMaterial({ color: 0xffffff })
    //     );
    //     collarRight.position.set(0.06, 1.2, 0.11);
    //     collarRight.rotation.z = 0.3;
    //     interviewer.add(collarRight);

    //     // Tie
    //     const tie = new THREE.Mesh(
    //         new THREE.BoxGeometry(0.05, 0.25, 0.02),
    //         new THREE.MeshStandardMaterial({ color: 0x8b0000 })
    //     );
    //     tie.position.set(0, 1.05, 0.11);
    //     interviewer.add(tie);

    //     // Arms
    //     const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16);
    //     const armMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });
        
    //     // Left arm
    //     const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    //     leftArm.position.set(-0.22, 0.95, 0);
    //     leftArm.rotation.z = 0.3;
    //     leftArm.castShadow = true;
    //     interviewer.add(leftArm);
        
    //     // Right arm (resting on desk)
    //     const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    //     rightArm.position.set(0.22, 0.95, 0.05);
    //     rightArm.rotation.z = -0.3;
    //     rightArm.castShadow = true;
    //     interviewer.add(rightArm);

    //     // Hands
    //     const handGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    //     const handMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
        
    //     const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    //     leftHand.position.set(-0.3, 0.75, 0);
    //     leftHand.castShadow = true;
    //     interviewer.add(leftHand);
        
    //     const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    //     rightHand.position.set(0.3, 0.75, 0.1);
    //     rightHand.castShadow = true;
    //     interviewer.add(rightHand);

    //     // Legs (sitting position)
    //     const legGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 16);
    //     const legMaterial = new THREE.MeshStandardMaterial({ color: pantColor });
        
    //     const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    //     leftLeg.position.set(-0.1, 0.6, 0);
    //     leftLeg.castShadow = true;
    //     interviewer.add(leftLeg);
        
    //     const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    //     rightLeg.position.set(0.1, 0.6, 0);
    //     rightLeg.castShadow = true;
    //     interviewer.add(rightLeg);

    //     // Shoes
    //     const shoeGeometry = new THREE.BoxGeometry(0.08, 0.06, 0.12);
    //     const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        
    //     const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    //     leftShoe.position.set(-0.1, 0.45, 0.05);
    //     leftShoe.castShadow = true;
    //     interviewer.add(leftShoe);
        
    //     const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    //     rightShoe.position.set(0.1, 0.45, 0.05);
    //     rightShoe.castShadow = true;
    //     interviewer.add(rightShoe);

    //     // Position interviewer on the chair
    //     interviewer.position.set(0, 0, -1.5);
    //     this.scene.add(interviewer);
    // }
}