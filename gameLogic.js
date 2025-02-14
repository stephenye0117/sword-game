// gameLogic.js
export class GameState {
    constructor(animationManager) {
        this.playerHealth = 100;
        this.enemyHealth = 100;
        this.currentTurn = 'player';
        this.actions = { player: 2, enemy: 2 };
        this.isAnimating = false;
        this.animationManager = animationManager;
    }

    async performAction(action, attacker, defender) {
        if (this.isAnimating || this.actions[attacker] <= 0) return false;
        
        this.isAnimating = true;
        this.actions[attacker]--;
        
        const attackerObj = attacker === 'player' ? player : enemy;
        const defenderObj = defender === 'player' ? player : enemy;
        
        let damage = 0;
        let message = '';
        
        switch(action) {
            case 'quick-attack':
                message = `${attacker} performs a quick attack!`;
                await this.animationManager.animateAttack(attackerObj, 'quick-attack');
                damage = Math.floor(Math.random() * 5) + 8;
                break;
                
            case 'heavy-attack':
                message = `${attacker} performs a heavy attack!`;
                await this.animationManager.animateAttack(attackerObj, 'heavy-attack');
                damage = Math.floor(Math.random() * 8) + 15;
                break;
                
            case 'block':
                message = `${attacker} takes a defensive stance!`;
                await this.animationManager.animateBlock(attackerObj);
                this[`${attacker}Blocking`] = true;
                break;
                
            case 'parry':
                message = `${attacker} prepares to parry!`;
                await this.animationManager.animateParry(attackerObj);
                this[`${attacker}Parrying`] = true;
                break;
        }
        
        await this.showMessage(message);
        
        if (damage > 0) {
            if (this[`${defender}Blocking`]) {
                damage = Math.floor(damage * 0.3);
                await this.showMessage(`${defender}'s block reduces the damage!`);
            } else if (this[`${defender}Parrying`]) {
                damage = 0;
                const counterDamage = Math.floor(Math.random() * 10) + 15;
                this[`${attacker}Health`] -= counterDamage;
                await this.animationManager.animateHit(attackerObj);
                await this.showMessage(`${defender} parries and counters for ${counterDamage} damage!`);
            } else {
                await this.animationManager.animateHit(defenderObj);
            }
            
            this[`${defender}Health`] -= damage;
            if (damage > 0) {
                await this.showMessage(`Deals ${damage} damage!`);
            }
        }
        
        this[`${defender}Blocking`] = false;
        this[`${defender}Parrying`] = false;
        
        this.updateUI();
        
        if (this.playerHealth <= 0 || this.enemyHealth <= 0) {
            await this.showMessage(this.playerHealth <= 0 ? 'Game Over! Enemy wins!' : 'Victory! Player wins!');
            this.resetGame();
            return true;
        }
        
        this.isAnimating = false;
        
        if (this.actions[this.currentTurn] <= 0) {
            this.endTurn();
        }
        
        return true;
    }

    async showMessage(message) {
        const display = document.getElementById('message-display');
        display.textContent = message;
        display.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 1000));
        display.style.display = 'none';
    }

    endTurn() {
        this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
        this.actions.player = 2;
        this.actions.enemy = 2;
        this.updateUI();
        
        if (this.currentTurn === 'enemy') {
            setTimeout(() => this.executeEnemyTurn(), 1000);
        }
    }

    async executeEnemyTurn() {
        while (this.currentTurn === 'enemy' && this.actions.enemy > 0) {
            const actions = ['quick-attack', 'heavy-attack', 'block', 'parry'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            await this.performAction(action, 'enemy', 'player');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    updateUI() {
        document.querySelector('#player-health .health-fill').style.width = 
            `${this.playerHealth}%`;
        document.querySelector('#enemy-health .health-fill').style.width = 
            `${this.enemyHealth}%`;
        
        document.getElementById('turn-indicator').textContent = 
            `${this.currentTurn}'s Turn - Actions: ${this.actions[this.currentTurn]}`;
        
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach(button => {
            button.disabled = this.currentTurn !== 'player' || this.actions.player <= 0;
        });
    }

    resetGame() {
        this.playerHealth = 100;
        this.enemyHealth = 100;
        this.currentTurn = 'player';
        this.actions = { player: 2, enemy: 2 };
        this.isAnimating = false;
        this.updateUI();
    }
}