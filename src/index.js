const players = [
  {
    nome: "Mario",
    velocidade: 4,
    manobrabilidade: 3,
    poder: 3,
    pontos: 0,
  },
  {
    nome: "Luigi",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 4,
    pontos: 0,
  },
  {
    nome: "Bowser",
    velocidade: 5,
    manobrabilidade: 2,
    poder: 5,
    pontos: 0,
  },
  {
    nome: "Peach",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 2,
    pontos: 0,
  },
  {
    nome: "Yoshi",
    velocidade: 2,
    manobrabilidade: 4,
    poder: 3,
    pontos: 0,
  },
  {
    nome: "Donkey Kong",
    velocidade: 2,
    manobrabilidade: 2,
    poder: 5,
    pontos: 0,
  },
];
const obstacles = ["🐢", "💣", "🍄"];

let player1 = {};
let player2 = {};

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;

    default:
      result = "CONFRONTO";
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}

async function typeRaceTrack(
  character1,
  character2,
  diceResult1,
  diceResult2,
  type
) {
  await logRollResult(
    character1.nome,
    type,
    diceResult1,
    character1[`${type}`]
  );
  await logRollResult(
    character2.nome,
    type,
    diceResult2,
    character2[`${type}`]
  );
}

async function obstacleFeedback(character, point, obstacle) {
  console.log(
    `Obstaculo ${obstacle} a frente ${character}, perdeu ${point} pontos!`
  );
  character.pontos--;
  if (character.pontos < 0) character.pontos = 0;
}

async function obstacleOnTheTrack(character, obstacle) {
  switch (obstacle) {
    case "🐢":
      obstacleFeedback(character.nome, "1", obstacle);

      break;

    case "💣":
      obstacleFeedback(character.nome, "2", obstacle);
      break;

    case "🍄":
      console.log(`Obstaculo 🍄 a frente ${character.nome}, Ganhou 5 pontos!`);
      character.pontos += 5;
      break;
  }
}

async function getObstacle() {
  const index = Math.floor(Math.random() * 3);
  return obstacles[index];
}

async function confrontCharacters(
  character1,
  character2,
  diceResult1,
  diceResult2
) {
  const powerResult1 = diceResult1 + character1.poder;
  const powerResult2 = diceResult2 + character2.poder;
  const obstacleCharacter1 = await getObstacle();
  const obstacleCharacter2 = await getObstacle();

  console.log(`${character1.nome} confrontou com ${character2.nome}!🥊`);

  await obstacleOnTheTrack(player1, obstacleCharacter1);
  await obstacleOnTheTrack(player2, obstacleCharacter2);

  await typeRaceTrack(
    character1,
    character2,
    diceResult1,
    diceResult2,
    "poder"
  );

  if (powerResult1 > powerResult2 && character2.pontos > 0) {
    lostPoint(character1, character2);
  }

  if (powerResult2 > powerResult1 && character1.pontos > 0) {
    lostPoint(character2, character1);
  }

  console.log(
    powerResult2 === powerResult1
      ? "Confronto empatado! Nenhum ponto foi perdido"
      : ""
  );
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    switch (block) {
      case "CONFRONTO":
        await confrontCharacters(
          character1,
          character2,
          diceResult1,
          diceResult2
        );
        break;

      case "CURVA":
        totalTestSkill1 = diceResult1 + character1.manobrabilidade;
        totalTestSkill2 = diceResult2 + character2.manobrabilidade;

        await typeRaceTrack(
          character1,
          character2,
          diceResult1,
          diceResult2,
          "manobrabilidade"
        );
        break;

      case "RETA":
        totalTestSkill1 = diceResult1 + character1.velocidade;
        totalTestSkill2 = diceResult2 + character2.velocidade;
        await typeRaceTrack(
          character1,
          character2,
          diceResult1,
          diceResult2,
          "velocidade"
        );
        break;
    }

    totalTestSkill1 > totalTestSkill2 && scoredPoint(character1);
    totalTestSkill2 > totalTestSkill1 && scoredPoint(character2);

    console.log("\n--------------------------------------------");
  }
}

async function declareWinner(character1, character2) {
  console.log("Resultado final: ");
  console.log(`${character1.nome}: ${character1.pontos} ponto(s)`);
  console.log(`${character2.nome}: ${character2.pontos} ponto(s)`);

  if (character1.pontos > character2.pontos)
    return victoryFeedback(character1.nome);

  if (character2.pontos > character1.pontos)
    return victoryFeedback(character2.nome);

  console.log("A corrida terminou em empate");
}

async function victoryFeedback(characterName) {
  console.log(`\n${characterName} venceu a corrida! Parabéns! 🏆`);
}

async function lostPoint(winner, loser) {
  console.log(
    `${winner.nome} venceu o confronto! ${loser.nome} perdeu 1 ponto 🐢`
  );
  loser.pontos--;
}

async function scoredPoint(character) {
  console.log(`${character.nome} marcou um ponto!`);
  character.pontos++;
}

async function setupRunners() {
  await setupPlayerOne();
  await setupPlayerTwo();
}

async function setupPlayerOne() {
  const indexPlayOne = await rollDice();
  player1 = players[indexPlayOne - 1];
}

async function setupPlayerTwo() {
  const indexPlayTwo = await rollDice();
  player2 = players[indexPlayTwo - 1];
  player1 == player2 && setupPlayerTwo();
}

(async function main() {
  await setupRunners();

  console.log(
    `🏁 🚨 Corrida entre ${player1.nome} e ${player2.nome} Começando...`
  );
  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);
})();
