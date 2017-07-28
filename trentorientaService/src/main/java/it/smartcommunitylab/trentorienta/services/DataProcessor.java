package it.smartcommunitylab.trentorienta.services;

import static org.hamcrest.CoreMatchers.instanceOf;

import java.io.Console;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.repository.EchoRepository;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepository;

@Component
public class DataProcessor {

	@Autowired
	private EventTypeRepository repoEvent;
	
	@Scheduled(initialDelay=0, fixedRate=60*60*1000)
	public void getDataPeriodically() {
		// call https://os.smartcommunitylab.it/comuneintasca-multi/events/TrentoInTasca
		// transform data
		// save to db
		Map<String, Object> input = new HashMap<>();
		input.put("fromTime", new Date().getTime());

		RestTemplate template = new RestTemplate();
		ArrayList list = template.postForObject("https://os.smartcommunitylab.it/comuneintasca-multi/events/TrentoInTasca", input, ArrayList.class);
		
		//System.out.println("*** Numero eventi trovati: " + list.size());
		
		for(int i = 0; i < list.size(); i ++) {
			Map<String, Object> riga = (Map<String, Object>) list.get(i);
			
			EventType evento = new EventType();
			
			// converto i valori nei campi di destinazione 
			evento.setId((String) riga.get("id"));
			// evento.setSource((String) riga.get("source"));
			evento.setSource("Eventi del Comune di Trento");

			String titolo = (String) ( (LinkedHashMap)riga.get("title") ).get("it");
			
			evento.setTitle((String) titolo);
			
			String descrizione = (String) ( (LinkedHashMap)riga.get("description") ).get("it");
			
			evento.setDescription((String) descrizione);
			
			String cat = (String) riga.get("category");
			if (cat == null) cat = "Evento";
			
			evento.setCategory(cat);
			
			evento.setImage((String) riga.get("image"));
			
			String periodo = (String) ( (LinkedHashMap)riga.get("eventPeriod") ).get("it");
			String durata = (String) ( (LinkedHashMap)riga.get("eventTiming") ).get("it");
			
			evento.setEventStart(periodo);
			evento.setEventTiming(durata);

			
			String tema = (String) riga.get("eventType");
			if (tema == null) tema = "Tema generico";
			
			evento.setThemes(tema);
			
			
			ArrayList topics = (ArrayList) riga.get("topics");
			
			evento.setTags(topics);
			
			Date date = new Date();
			
			Long l = Long.valueOf(riga.get("fromTime").toString());
			
			date.setTime(l.longValue());
			
			evento.setEventDate(new SimpleDateFormat("YYYMMddHHmm").format(date));
			
			l = Long.valueOf(riga.get("toTime").toString());
			date.setTime(l.longValue());

			evento.setToTime(Long.parseLong(new SimpleDateFormat("YYYMMddHHmm").format(date)));
			
			l = Long.valueOf(riga.get("lastModified").toString());
			date.setTime(l.longValue());
			
			evento.setCreated(new SimpleDateFormat("YYYMMddHHmm").format(date));
			
			// Ottengo le coordinate dell'evento
			// https://os.smartcommunitylab.it/core.geocoder/spring/address?address= INDIRIZZO

			Map<String, String> input2 = new HashMap<String, String>();
			
			String indirizzo = (String) ( (LinkedHashMap)riga.get("address") ).get("it");
			
			input2.put("address", indirizzo);
			input2.put("latlng", "46.0655,11.1086");
			input2.put("distance", "10");

			// System.out.println("\n\n****" + indirizzo);
			
			evento.setAddress(indirizzo);
			
			RestTemplate template1 = new RestTemplate();
			HashMap list1 = template1.getForObject("https://os.smartcommunitylab.it/core.geocoder/spring/address?address={address}&latlng={latlng}&distance={distance}&rows=1", HashMap.class, input2);
			
			try {
				String coord = (String) ((LinkedHashMap) ((ArrayList) ((LinkedHashMap) list1.get("response")).get("docs")).get(0)).get("coordinate");
				
				// System.out.println("Corodinate dal sito: " + coord);
				
				evento.setCoordX( Float.parseFloat(coord.split(",")[0]) );
				evento.setCoordY( Float.parseFloat(coord.split(",")[1]) );
			} catch (Exception e) {
				evento.setCoordX(new Float(0));
				evento.setCoordY(new Float(0));
			}
			
			// System.out.println("Coordinate trovate:" + evento.getCoordX() + "," + evento.getCoordY());
			
			// System.out.println ("************* title = " + titolo);
			
			repoEvent.save(evento);
			
		}
		
		// avvisi del Comune di Trento (limitata a 20 eventi 
		
		String nLimit = "20";
		
		HashMap listComune = template.getForObject("http://www.comune.trento.it/api/opendata/v1/content/class/avviso/offset/0/limit/20", HashMap.class);
		
		ArrayList list1 = (ArrayList) listComune.get("nodes");
		
		for(int i = 0; i < list1.size(); i ++) {
			Map<String, Object> riga = (Map<String, Object>) list1.get(i);
			
			String url = (String) riga.get("link");
			
			HashMap pagina = template.getForObject(url, HashMap.class);
			
			HashMap fields = (HashMap) pagina.get("fields");
			
			String titolo = (String) ( (HashMap) fields.get("titolo") ).get("value");
			
			EventType evento = new EventType();
			
			evento.setTitle(titolo);
			
			evento.setSource("Avvisi del Comune di Trento");
			
			String descrizione = (String) ( (HashMap) fields.get("descrizione") ).get("string_value");
			
			evento.setDescription(descrizione);
			
			String categoria = "";
			
			Object value = ((HashMap) fields.get("argomento") ).get("value");
			
			if (value instanceof Boolean) {
				categoria = "Avvisi";
			} else {
				categoria = (String) ((HashMap) value).get("objectName");
				if (categoria == null) categoria = "Avvisi";
			}
			
			evento.setCategory(categoria);
			evento.setThemes(categoria);
			
			String immagine = (String) ( (HashMap) fields.get("image") ).get("value");
			
			evento.setImage(immagine);
			
			String eventDate = (String) ( (HashMap) fields.get("data") ).get("value");
			String dataInizio = new SimpleDateFormat("YYYMMddHHmm").format(new Date(Integer.parseInt(eventDate)));
			evento.setEventDate(dataInizio);
			
			evento.setEventStart( new SimpleDateFormat("dd/MM/YYYY").format(new Date(Integer.parseInt(eventDate))));
			
			evento.setEventTiming("");
			
			ArrayList tags = new ArrayList();
			tags.add(categoria);
			
			evento.setTags(tags);
			
			// System.out.println( ( (HashMap) fields.get("gps") ).get("value") );
			
			evento.setCoordX(new Float(46.0));
			evento.setCoordY(new Float(11.0));
			
			evento.setCreated(dataInizio);
			
			String eventFine = (String) ( (HashMap) fields.get("data_archiviazione") ).get("value");
			String toTime = new SimpleDateFormat("YYYMMddHHmm").format(new Date(Integer.parseInt(eventFine)));
			evento.setToTime(Long.parseLong(toTime));
			
			evento.setAddress("Comune di Trento");
			
			repoEvent.save(evento);
		}

		
	}
}
