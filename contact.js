function procesa_envio(event) {
	//Prevenir default de envío de navegador
	event.preventDefault();
	
	console.log("procesando envío");
	
	//output - mensajes a mostrar al usuario
	let salida = document.getElementById("salida");
	
	//campo obligatorio - name
	let nombre = document.getElementById("nombre");
	//mínimos requeridos - no se cumplen, no se envía
	if (nombre.value.length < 2){
		salida.value = "El nombre debe tener al menos 2 carácteres";
		salida.style.color = "#ff0000";
		nombre.style.color = "#ff0000";
		nombre.style.border = "2px solid #ff0000";
		
		nombre.focus();
		return false;
	}
	//mínimos cumplidos:
	nombre.style.color = "#00ff00";
	nombre.style.border = "2px solid #00ff00";
	
	//campo obligatorio - email
	let email = document.getElementById("email");
	//expresiones regulares
	let regularExpr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!regularExpr.test(email.value)){
		salida.value = "El email no es válido";
		salida.style.color = "#ff0000";
		email.style.color = "#ff0000";
		email.style.border = "2px solid #ff0000";
		
		email.focus();
		return false;
	}
	if (email.value.length < 6){
		salida.value = "El email debe de tener al menos 6 carácteres";
		salida.style.color = "#ff0000";
		email.style.color = "#ff0000";
		email.style.border = "2px solid #ff0000";
		
		email.focus();
		return false;
	}
	email.style.color = "#00ff00";
	email.style.border = "2px solid #00ff00";
	
	//campo obligatorio - mensaje
	let mensaje = document.getElementById("mensaje");
	if (mensaje.value.length < 5){
		salida.value = "El mensaje debe de ser más largo";
		salida.style.color = "#ff0000";
		mensaje.style.color = "#ff0000";
		mensaje.style.border = "2px solid #ff0000";
		
		mensaje.focus();
		return false;
	}
	mensaje.style.color = "#00ff00";
	mensaje.style.border = "2px solid #00ff00";
	
	//Todo correcto - se envía formulario
	document.getElementById("form_contacto").submit();
}