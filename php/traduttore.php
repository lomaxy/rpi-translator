<?php
/*
 Implementazione del traduttore di Google 
 Solo ad uso sperimentale - Lomazzi Federico /10/2019
 ATTENZIONE!
 Questa procedura ha solo scopo sperimentale, e non và usata per richieste intensive al traduttore di Google!
 La prassi corretta, in questi casi, è l'iscrizione al servizio API Translate di Google
 Usare questo script solo ed esclusivamente per brevi e saltuari collaudi
*/
header('Content-Type: text/html; charset=ISO-8859-1');
//Traduzione attraverso google-search
//Prelevo i parametri
$frase = rawurlencode($_GET["frase"]); 
isset($_GET["lingua"])? $lingua = rawurlencode($_GET["lingua"]) :$lingua="inglese";
$marker="wellapeppa."; //Marker per ancorare la restituzione della traduzione (vale qualsiasi stringa intraducibile..)
//Creo l'url di ricerca
$ricerca= file_get_contents('https://www.google.com/search?q=traduci%20"'.$marker.'%20'.$frase.'"%20in%20'.$lingua);
$ricerca=urldecode($ricerca);
//Isolo il marker e lo "salto"; il marker viene analizzato in più varianti, restituite dal traduttore di google
$detMarker=array("\">$marker \"","\">$marker&#","\">$marker ","\">$marker. \"","\">$marker.");
$currMaker="";
$mrkPos=0;
//ciclo di scansione delle ipotesi di restituzione marker
foreach($detMarker as $currMaker) { 
 $mrkPos=strpos($ricerca,$currMaker);
 if ($mrkPos>0) {
	 //Trovato
	 break;
 }
}
//Circoscrivo la traduzione tra inizio..
$Traduzione=substr($ricerca,$mrkPos+strlen($currMaker)-1);
$PosEnd=strpos($Traduzione,"</");
//..e fine
$Traduzione=substr($Traduzione,1,$PosEnd-1);
// restituisco la traduzione se questa non contiene errori, altrimenti restituisco "error"
if ((strpos($Traduzione,"<")=== FALSE) && (strpos($Traduzione,">")===FALSE)) {
	echo $Traduzione;
	} else {
		echo "Error";
	}
?>