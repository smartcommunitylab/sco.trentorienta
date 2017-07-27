package it.smartcommunitylab.trentorienta.services;

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
		
		EventType evento = new EventType();

		RestTemplate template = new RestTemplate();
		ArrayList list = template.postForObject("https://os.smartcommunitylab.it/comuneintasca-multi/events/TrentoInTasca", input, ArrayList.class);
		
		ArrayList<EventType> eventi = new ArrayList<>();
		
		// System.out.println("*** Numero eventi trovati: " + list.size());
		
		for(int i = 0; i < list.size(); i ++) {
			Map<String, Object> riga = (Map<String, Object>) list.get(i);
			
			// converto i valori nei campi di destinazione 
			evento.setId((String) riga.get("id"));
			// evento.setSource((String) riga.get("source"));
			evento.setSource("Eventi del Comune di Trento");
			
			String titolo = (String) ( (LinkedHashMap)riga.get("title") ).get("it");
			
			evento.setTitle((String) titolo);
			
			String descrizione = (String) ( (LinkedHashMap)riga.get("description") ).get("it");
			
			evento.setDescription((String) descrizione);
			
			evento.setCategory((String) riga.get("category"));
			
			evento.setImage((String) riga.get("image"));
			
			String periodo = (String) ( (LinkedHashMap)riga.get("eventPeriod") ).get("it");
			String durata = (String) ( (LinkedHashMap)riga.get("eventTiming") ).get("it");
			
			evento.setEventStart(periodo);
			evento.setEventTiming(durata);

			
			evento.setThemes((String) riga.get("eventType"));
			
			
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
			
			eventi.add(evento);
			
			// System.out.println ("************* title = " + titolo);
			
			repoEvent.save(evento);
			
		}
		
		// System.out.println ("************* " + eventi.size());
		
		// repoEvent.save(eventi);

		// System.out.println ("****" + repoEvent.count());
	}
}
