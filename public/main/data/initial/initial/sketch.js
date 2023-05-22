var numero_de_agentes = 4000;	// numero de agentes
var distancia_sensorial = 6;	// quão longe o agente procura comida
var angulo_sensorial = 40;		// quão ampla é a visão do agente
var velocidade_do_giro = 0.3;	// quão rápido o agente gira
var velocidade = 6;						// quão rápido o agente se move
var fator_decaimento = 0.8;		// quão rápido a comida acaba se o agente não caminhar sobre ela
var deposito_comida = 0.4;		// quanta comida é depositada quando o agente caminha
var giro_aleatorio = false;		// o agente gira aleatoriamente

var physarum;

function setup() {
		// Qual o tamanho da área de desenho?
		// O primeiro número define a largura
		// O segundo define a altura
		createCanvas(1920, 1080);
	
		// Construindo o Physarum
		// É nele que o comportamento de todos os agentes é gerenciado
		// Os parâmetros da função foram definidos pelas varíaveis no início do código
		physarum = new Physarum(width, height, drawingContext, distancia_sensorial, angulo_sensorial, velocidade_do_giro, velocidade, fator_decaimento, deposito_comida, giro_aleatorio);

		// As variável "cores" define as cores possíveis para os agentes
		// Note que as cores são descritas por 3 números.
		// Este é o sistema de cor RGB (Red+Green+Blue ou Vermelho+Verde+Azul).
		// O primeiro número manipula a quantidade de Vermelho, que vai de 0 à 255
		// O segundo número manipula a quantidade de Verde, que vai de 0 à 255
		// O terceiro número manipula a quantidade de Azul, que vai de 0 à 255
		var cores = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];
	
	
		// Vamos adicionar os agentes
		// São milhares de agentes para adicionar
		// Por isso utilizamos o for, um laço de repetição (looping) 
		for (let i = 0; i < numero_de_agentes; ++i) {
				// utilizamos a aleatoriedade para cada vez que adicionamos um agente
				var x = random(0, width);// x vai receber um valor entre 0 e a largura da tela
				var y = random(0, height);// y vai receber um valor entre 0 e a altura da tela
				var angulo = random(360);// o angulo vai ficar entre 0 e 360
				var cor = random(cores);// e a cor vai receber uma das cores que definimos anteriormente
			
				// com as variaveis definidas, adicionamos nosso agente no Physarum
				physarum.addAgent(x, y, angulo, cor);
		}
}

function draw() {
		// vamos definir a cor de fundo
		// o preto é definido pelos 3 primeiros números em 0
		// o 0 é a intensidade mínima, ou seja, desligado
		// o 4 número é a transparência, que também pode variar entre 0 e 255
		// com a transparência em 10, podemos apagar o fundo gradualmente
		// e assim ver o rastro dos agentes
		var corDeFundo = color(0, 0, 0, 10);
	
		// definimos a cor de preenchimento com a função fill()
		fill(corDeFundo);
	
		// tiramos a linha de contorno da forma que vamos desenhar
		noStroke();
	
		// pintamos um retângulo com a cor de preenchimento
		// a posição do retângulo fica no x=0 e no y=0
		// a largura e altura utiliza as dimensões da tela
		rect(0, 0, width, height);

		// Atualizamos o Physarum
		// Dentro dessa função ele calcula a posição de todos os agentes
		physarum.update(); 
	
		// Desenhamos os agentes em suas novas posições
		physarum.draw();
}

