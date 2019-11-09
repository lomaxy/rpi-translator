/*
  MODULO VOICEMAIN
  by LOMAZZI FEDERICO 11/2019  
  http://www.lomazzifederico.it
  http://lomazzifederico.altervista.org/progettazione-elettronica/#  
*/

//responsivevoice
const attivazione = "traduci";		// Parola che attiva la traduzione
var RVlangName = "UK English Male"; // Lingua default ResponsiveVoice
var LinguaDestinazione="inglese";	// Lingua nella quale avviene la traduzione
var Genere="Male";					// Genere (Male/Female)


function selgenere(){
		 //Seleziona voce maschile o femminile		
		 if ($("#icnGenereFemale").css('visibility')=="hidden") {
		    //L'icona selezionata è maschile: imposto femminile
			$("#icnGenereFemale").css("visibility", "visible");
			$("#icnGenereMale").css("visibility", "hidden");			
			Genere="Female"			
		 } else {
			//L'icona selezionata è femminile: imposto maschile
			$("#icnGenereFemale").css("visibility", "hidden");
			$("#icnGenereMale").css("visibility", "visible");			
			Genere="Male"			
		 }
		 // Rigenera RVlangName
		 selPaese();	
	}


function selPaese() {
 //Cambio del paese
 switch ($("#selPaese").val()) {
	case "BR":  //Brasile	 
	 RVlangName="Portuguese "+Genere;
	 LinguaDestinazione="portoghese";
	 break;
	case "ES":  //Spagna	 
	 RVlangName="Spanish "+Genere;
	 LinguaDestinazione="spagnolo";
	 break; 
	case "FR":  //FRANCIA	 
	 RVlangName="French "+Genere;
	 LinguaDestinazione="francese";
	 break;
	case "DE":  //GERMANIA	 
	 RVlangName="Deutsch "+Genere;
	 LinguaDestinazione="tedesco";
	 break;
	case "HK":  //HONG-KONG (Japponese)	 
	 RVlangName="Japanese "+Genere;
	 LinguaDestinazione="giapponese";
	 break; 
	case "NL":  //Netherland	 
	 RVlangName="Finnish "+Genere;
	 LinguaDestinazione="olandese";
	 break; 
	case "PL":  //Polonia	 
	 RVlangName="Polish "+Genere;
	 LinguaDestinazione="polacco";
	 break;  	 
	case "RU":  //Russia	 
	 RVlangName="Russian "+Genere;
	 LinguaDestinazione="russo";
	 break;  
	case "TW":  //Taiwan	 
	 RVlangName="Chinese "+Genere;
	 LinguaDestinazione="cinese";
	 break;  
	case "US":  //America	 
	 RVlangName="US English "+Genere;
	 LinguaDestinazione="inglese";
	 break;   
	case "GB":  //America	 
	 RVlangName="UK English "+Genere;
	 LinguaDestinazione="inglese";
	 break;   
	} 	
		
	//Se c'è una frase da tradurre la traduco nella nuova lingua
	if (fraseDaTradurre != "") {	
		Traduci(fraseDaTradurre);
	}		
}
 

    window.addEventListener('DOMContentLoaded', () => {			
			//Responsivevoice eventi
			responsiveVoice.AddEventListener("OnLoad",function(){
				console.log("ResponsiveVoice Loaded Callback") ;
				responsiveVoice.speak('Pronto a tradurre!','Italian Female');	
			});			
			//ResponsiveVoice
			responsiveVoice.AddEventListener("OnReady",function(){			
				//Carico le voci 
				RVCaricaVoci();	
			});								
			//Avvio il riconoscimento vocale 
			doRiconoscimentoVocale();						
      });
	  	  		  
	  
	  let fraseTradotta="";    //Ultima frase tradotta
	  let fraseDaTradurre="";  //Ultima frase pronunciata da tradurre	
	  let blnAscolta=false;	   //Modalità ascolto	
	  let voceStart=false;	   //Voce in modalità start (evita bug "Failed to execute 'start' on 'SpeechRecognition': recognition has already started.")

	  
	  //Call back del sintetizzatore vocale; quando parla non ascolta..	
	  function voceStartCallback() {
		   riconoscimentoVocale.stop();
		   voceStart=false;
		   }
	  function voceEndCallback()   {
		   if (!voceStart) {
			riconoscimentoVocale.start();
			voceStart=true;
		    }
		   }
		   
	  //Callback relativi all'inizio della emissione parlato (onstart) e fine della emissione parlato (voceEndCallback)
	  var callbacks = {
			onstart: voceStartCallback,
			onend: voceEndCallback
			}
	  
	  //Funzione Parla
	  function Parla(frase,lRVlangName) {
	   if (blnAscolta) {
	    //Emetto la frase nella lingua italiana
		  blnAscolta=false;	
		  Parla(fraseTradotta.replace("?", ""),'Italian Female');		
		  $("#btnlisten").css("border","none");
	   } else if (frase.trim != "") {
	     if (lRVlangName=="") {lRVlangName=RVlangName;}
	     responsiveVoice.speak(frase,lRVlangName,callbacks);
		 }
	   }
	  
	  
	  //Emette la frase tradotta
	  function emetti_frase_tradotta() {
	    //Emette la frase tradotta    	    
	    Parla(fraseTradotta,"");	  
	   }
	  
	  
	   //Dispone ascolto, pronunciando in italiano
	  function disponi_ascolto() {	  
	   if (!blnAscolta) { 
	    //Dispongo ascolto		
		$("#txtSentito").val("");		// Clear testo del sentito
		$("#txtTradotto").val("");		// Clear testo del tradotto	
		$("#btnlisten").css("border","thick solid #0000FF");  //Bordo colorato
		blnAscolta=true;
		} else {
			//Emetto la frase nella lingua italiana
			blnAscolta=false;	
			Parla(fraseTradotta.replace("?", ""),'Italian Female');		  
			$("#btnlisten").css("border","none");
		}
	  }


function RVCaricaVoci() {    
        //Carichiamo i nomi delle voci disponibili; ci serviranno per i prossimi esempi
        responsiveVoice.getVoices().forEach(function(voce) {console.log(voce.name);});   
}


function xUnescape(value) {
	//Converto in stringa gli eventuali caratteri escape (&Hxxx;)
    return $('<div/>').html(value).text();
}

function Traduci(frase) {
   //Chiama il modulo php per la traduzione
   var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {			    
				fraseTradotta=xUnescape(this.responseText);                		
				$("#txtTradotto").val(fraseTradotta);								
				Parla(fraseTradotta,"");
            }
        };
		//Chiamata ajax 
        ajax.open("GET", "./php/traduttore.php?frase=" +frase+"&lingua="+LinguaDestinazione, true);
        ajax.send();
  }

/*
								RICONOSCIMENTO VOCALE ATTRAVERSO LE WEB SPEECH API
*/
var riconoscimentoVocale;  
function doRiconoscimentoVocale() {	

    /* Dichiariamo il motore di riconoscimento vocale, la sua "grammatica" e gli eventi. 
	   Usiamo 'SpeechRecognition' come nome in quanto esso è il nome dell'oggetto in Firefox, mentre in Chrome l'oggetto 
	   si chiama webkitSpeechRecognition: in questo modo la dichiarazione è indipendente dal browser che stiamo usando. 
	   Allo stesso modo dichiariamo nomi quali SpeechGrammarList e SpeechRecognitionEvent, così da poter funzionare sia 
	   su firefox che su chrome. In pratica i nomi dei relativi oggetti su Chrome sono prefissati con "webkit", 
	   prefisso non presente su firefox (mozilla).
	   La SpeechGrammarList rappresenta un elenco di parole o gruppi di parole che vogliamo siano riconosciute. Di default
	   saranno riconosciute tutte le parole, oppure potremmo decidere di restringere il campo solo ad alcuni vocaboli.
	   Prestare attenzione al fatto che, comunque, su Chrome questo meccanismo non sembra funzionare per niente...
	   Il formato usato per la definizione dei vocaboli è il JSGF (Formato grammaticale per Java), di Sun.
	   La sintassi per il confinamento di solo alcuni vocaboli è la seguente:

		// L'array vocaboli contiene gli unici vocaboli	che voglio siano riconosciuti in lingua italian
		var vocaboli = ['accendi' , 'spegni' , 'alza', 'abbassa'];
		// Creo la stringa nel formato JSGF
		var svocaboli = '#JSGF V1.0; grammar prova; public <lampadina> = '+vocaboli.join(' | ')+' ;';
		// Istanzio il motore di riconoscimento vocale
		riconoscimentoVocale = new SpeechRecognition();      					
		// Creo una nuova lista grammaticale vuota
		var speechRecognitionList = new SpeechGrammarList("");  		
		// Ci inserisco i miei vocaboli (formato JSGF)   
		speechRecognitionList.addFromString(svocaboli, 1);			
		// Collego la mia grammatica al riconoscimento vocale
		riconoscimentoVocale.grammars = speechRecognitionList;				
	   
   */
   var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;   
   var SpeechGrammarList  = SpeechGrammarList || webkitSpeechGrammarList;
   var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;     
   riconoscimentoVocale = new SpeechRecognition();      					// Creiamo l'istanza del motore di riconoscimento vocale
   
   //Imposto frase per attivazione	
   document.body.style.visibility="visible";
  
   //Di default imposto la lingua italiana
   riconoscimentoVocale.lang = "it-IT";  					
   
   //Non desidero avere restituzione dei risultati provvisori
   riconoscimentoVocale.interimResults = false; 
   //Non desidero un riconoscimento continuo
   riconoscimentoVocale.continuous = false;
   //Voglio una sola alternativa della traduzione rilevata
   riconoscimentoVocale.maxAlternatives = 1;
   //Avvio il riconoscimento vocale
   riconoscimentoVocale.start();

  riconoscimentoVocale.onresult = function(event) {

/* La proprietà dei risultati SpeechRecognitionEvent restituisce un oggetto SpeechRecognitionResultList, che contiene
   oggetti "SpeechRecognitionResult"; ha un getter, pertanto possiamo accedervi come un array.   
   Il primo indice [0] restituisce SpeechRecognitionResult nella posizione 0.
   Ogni oggetto SpeechRecognitionResult contiene oggetti SpeechRecognitionAlternative che contengono risultati individuali.
   Questi hanno anche getter in modo che possano essere raggiunti come array.
   Il secondo [0] restituisce SpeechRecognitionAlternative nella posizione 0.
   Restituiamo quindi la proprietà della trascrizione dell'oggetto indize 0 nella SpeechRecognitionAlternative, che avevamo
   impostato a 1 (1 sola alternativa di riconoscimento)   
*/
	var speechResult = event.results[0][0].transcript;
	var Confidence = event.results[0][0].confidence;    
	
	$('#txtSentito').val(speechResult.toLowerCase());	
	//Chiamo il traduttore
	if (speechResult.toLowerCase().indexOf(attivazione)!=-1 || blnAscolta ) {
	 fraseDaTradurre=speechResult.toLowerCase().replace(attivazione, "");
	 $("#txtSentito").val(fraseDaTradurre);
	 Traduci(fraseDaTradurre);
	} else {
	 //Annullo il sentito
	 $("#txtSentito").val("");
	}
  }

  riconoscimentoVocale.onspeechend = function() {
    //Riavvio il riconoscimento vocale
    doRiconoscimentoVocale();	
  }

  riconoscimentoVocale.onerror = function(event) {    
    //Errore
	if ((event.error=='no-speech') || (event.error=='network')) {
		doRiconoscimentoVocale();
	} else {
		console.log('Errore rilevato: ' + event.error);		
		//Verifico connessione microfono
		if(navigator.getUserMedia || navigator.webkitGetUserMedia)
			{
				console.log("Microfono connesso.");
			} else {
				console.log("Microfono NON connesso.");
			}		
	}
  }   
}