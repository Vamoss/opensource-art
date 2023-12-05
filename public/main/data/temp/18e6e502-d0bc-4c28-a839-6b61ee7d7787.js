const lados = 6

var tamanho = 30

var cores
var contaCor = 10

var pos = 
var dir = 1
var raio = 10
var angulo = 0

function setup() {
	createCanvas(windowWidth, windowHeight)
	background(0)
	strokeWeight(2)
	
	cores = [color("#2b2244"), color("#581845"), color("#900C3F"), color("#C70039"), color("#e32c36"), color("#FF5733"), color("#FFC30F"), color("#24fffb"), color("#2b2244")]
	
	pos = {x: width/2, y: height/2}
	prevPos = {x: pos.x, y: pos.y}
}

function draw() {	
	angulo += 1/raio*dir

	var posicaoXAnterior = pos.x
	var posicaoYAnterior = pos.y
	pos.x += cos(angulo) * raio
	pos.y += sin(angulo) * raio

	//variação de cores
	contaCor += noise(frameCount/1000)/200
	var col = graduacaoDeCores(contaCor%1, cores)
	
	//desenha
	for(var a = 0; a < TWO_PI; a += TWO_PI/lados){
		push()
			translate(width/2, height/2)
			rotate(a)
			translate(-width/2, -height/2)
		
			strokeWeight(tamanho)
			noFill()
			stroke(col)
			line(posicaoXAnterior, posicaoYAnterior, pos.x, pos.y)
		pop()
	}
		
	//muda a direção
	if(pos.x < (tamanho+10) || pos.x > width-(tamanho+10) || pos.y < (tamanho+10) || pos.y > height-(tamanho+10)){
		//se colidir com a borda
		angulo += PI * dir
	}else{
		//ou aleatoriamente
		if(random() < 0.05) dir *= -1
		if(random() < 0.05) raio = random(5, 8)
	}
}

function graduacaoDeCores(percentagem, cores)
{
	var i = Math.floor(percentagem*(cores.length-1))
	if(i < 0) return cores[0]
	if(i >= cores.length-1) return cores[cores.length-1]

	var percent = (percentagem - i / (cores.length-1)) * (cores.length-1)
	return color(
		cores[i]._getRed() + percent*(cores[i+1]._getRed()-cores[i]._getRed()),
		cores[i]._getGreen() + percent*(cores[i+1]._getGreen()-cores[i]._getGreen()),
		cores[i]._getBlue() + percent*(cores[i+1]._getBlue()-cores[i]._getBlue())
	)
}