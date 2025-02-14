// animations.js
export class AnimationManager {
    constructor() {
        this.currentAnimation = null;
        this.tweens = [];
    }

    async animateAttack(character, type) {
        const sword = character.children[2]; // Sword group
        const originalPosition = sword.position.clone();
        const originalRotation = sword.rotation.clone();
        const characterOriginalRotation = character.rotation.clone();
        
        // Reset any existing animations
        sword.position.copy(originalPosition);
        sword.rotation.copy(originalRotation);

        const duration = type === 'quick-attack' ? 500 : 800;

        // Character rotation for attack
        const charRotateTween = new TWEEN.Tween(character.rotation)
            .to({ y: characterOriginalRotation.y + (Math.PI * 0.3) }, duration * 0.3)
            .easing(TWEEN.Easing.Quadratic.Out);

        const charReturnTween = new TWEEN.Tween(character.rotation)
            .to({ y: characterOriginalRotation.y }, duration * 0.3)
            .easing(TWEEN.Easing.Quadratic.In);

        // Forward thrust animation
        const thrustTween = new TWEEN.Tween(sword.position)
            .to({ 
                z: originalPosition.z + 1,
                y: originalPosition.y + 0.3
            }, duration * 0.3)
            .easing(TWEEN.Easing.Quadratic.Out);

        // Return from thrust
        const returnTween = new TWEEN.Tween(sword.position)
            .to({ 
                z: originalPosition.z,
                y: originalPosition.y
            }, duration * 0.3)
            .easing(TWEEN.Easing.Quadratic.In);

        // Chain animations
        thrustTween.chain(returnTween);
        charRotateTween.chain(charReturnTween);

        // Start animations
        thrustTween.start();
        charRotateTween.start();

        return new Promise(resolve => {
            returnTween.onComplete(() => {
                character.rotation.copy(characterOriginalRotation);
                resolve();
            });
        });
    }

    async animateBlock(character) {
        const sword = character.children[2];
        const originalPosition = sword.position.clone();
        const originalRotation = sword.rotation.clone();

        // Move sword to blocking position
        const blockTween = new TWEEN.Tween(sword.rotation)
            .to({
                x: Math.PI / 4,
                y: 0,
                z: Math.PI / 2
            }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);

        // Hold block position
        await new Promise(resolve => {
            blockTween.start();
            setTimeout(resolve, 500);
        });

        // Return to original position
        const returnTween = new TWEEN.Tween(sword.rotation)
            .to({
                x: originalRotation.x,
                y: originalRotation.y,
                z: originalRotation.z
            }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

        return new Promise(resolve => {
            returnTween.onComplete(resolve);
        });
    }

    async animateParry(character) {
        const sword = character.children[2];
        const originalRotation = sword.rotation.clone();

        // Quick diagonal slash movement
        const parryTween = new TWEEN.Tween(sword.rotation)
            .to({
                x: Math.PI / 6,
                y: -Math.PI / 4,
                z: Math.PI * 1.5
            }, 200)
            .easing(TWEEN.Easing.Cubic.Out);

        // Return to original position
        const returnTween = new TWEEN.Tween(sword.rotation)
            .to({
                x: originalRotation.x,
                y: originalRotation.y,
                z: originalRotation.z
            }, 200)
            .easing(TWEEN.Easing.Cubic.In);

        parryTween.chain(returnTween);
        parryTween.start();

        return new Promise(resolve => {
            returnTween.onComplete(resolve);
        });
    }

    async animateHit(character) {
        const originalPosition = character.position.clone();
        
        const recoilTween = new TWEEN.Tween(character.position)
            .to({
                z: originalPosition.z + (character === player ? 0.5 : -0.5)
            }, 100)
            .easing(TWEEN.Easing.Quadratic.Out);

        const returnTween = new TWEEN.Tween(character.position)
            .to({
                z: originalPosition.z
            }, 200)
            .easing(TWEEN.Easing.Elastic.Out);

        recoilTween.chain(returnTween);
        recoilTween.start();

        return new Promise(resolve => {
            returnTween.onComplete(resolve);
        });
    }
}