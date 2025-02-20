
<template>
  <div class="dice">

    <!-- Основное меню -->
    <div class="main-menu" v-if="diceStore.showMenu">
      <div class="menu-content">
        <p class="offer-text">Вы предлагаете {{ diceStore.targetName }} сыграть в кости на</p>
        <div class="input-group">
          <input type="number" class="bet-input"  v-model="diceStore.betValue" placeholder="0"/>
          <button class="bet-button" @click="diceStore.placeBet()">Сделать ставку</button>
        </div>
        <h2 class="game-title">Игра в кости (F2 курсор)</h2>
      </div>
    </div>

    <!-- Окно подтверждения -->
    <div class="confirmation" v-if="diceStore.showNoty">
      <div class="confirmation-content">
        <p class="offer-info">{{ diceStore.initiatorName }} предлагает вам сыграть в кости на сумму ${{ diceStore.callBet }} (F2 курсор)</p>
        <div class="buttons-container">
          <button class="decline-btn" @click="diceStore.declineBtn()">Отказаться</button>
          <button class="accept-btn" @click="diceStore.acceptBtn()">Согласиться</button>
        </div>
      </div>
    </div>

    <div class="result-overlay" v-if="diceStore.showResult">
      <div class="result-modal">
        <h3 class="result-title" :style="{ color: diceStore.getResultColor() }">{{ diceStore.getResultTitle() }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { DiceStore } from "@/stores/interfaces/dice.js";

const diceStore = DiceStore();

onMounted(() => {
  if (typeof mp !== 'undefined') {
    mp.events.add('cef::dice.show', (menu, value, value2 = null) => {
      diceStore.open(menu, value, value2)
    });
    mp.events.add('cef::dice.hide', () => {
      diceStore.showMenu = false;
    });
  }
});

</script>

<style scoped>
@font-face {
  font-family: 'Akrobat';
}

.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.result-title {
  font-size: 74px;
}

.close-btn {
  background: #C03737;
  border: 1px solid #F70808;
  color: #FFFFFF;
  padding: 8px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #a82f2f;
}

@media (max-width: 480px) {
  .result-modal {
    padding: 1.5rem;
  }

  .result-title {
    font-size: 20px;
  }
}

.dice {
  position: relative;
  width: 100%;
  min-height: 100vh;
  font-family: 'Mazzard', sans-serif;
}

.main-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #bebebe;
  border-radius: 21px;
  padding: 20px;
  width: 90%;
  max-width: 360px;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.offer-text {
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  text-align: center;
  margin: 0;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.bet-input {
  height: 25px;
  background: #d9d9d9;
  border: 1px solid #fff7f7;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
}

.bet-button {
  width: 100%;
  height: 25px;
  background: #b11d1d;
  border: 1px solid #f70808;
  border-radius: 4px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.bet-button:hover {
  background: #e42323;
  border: 1px solid #f70808;
}

.game-title {
  font-size: 20px;
  color: #ffffff;
  margin: 10px 0 0 0;
}

.confirmation {
  position: fixed;
  bottom: 320px;
  left: 20px;
  right: 20px;
  max-width: 360px;
  background: #bebebe;
  border-radius: 10px;
  padding: 15px;
}

.confirmation-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.offer-info {
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  margin: 0;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.decline-btn {
  background: #c03737;
  border: 1px solid #f70808;
  color: #ffffff;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.decline-btn:hover {
  background: #d81616;
}

.accept-btn {
  background: #19d24a;
  border: 1px solid #72e064;
  color: #ffffff;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.accept-btn:hover {
  background: #00ff46;
}

@media (max-width: 768px) {
  .main-menu {
    width: 80%;
  }

  .confirmation {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
}
</style>
