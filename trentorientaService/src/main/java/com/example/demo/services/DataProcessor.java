package com.example.demo.services;

import java.io.Console;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.example.demo.model.EventType;
import com.example.demo.repository.EchoRepository;
import com.example.demo.repository.EventTypeRepository;

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

			evento.setToTime(new SimpleDateFormat("YYYMMddHHmm").format(date));
			
			l = Long.valueOf(riga.get("lastModified").toString());
			date.setTime(l.longValue());
			
			evento.setCreated(new SimpleDateFormat("YYYMMddHHmm").format(date));
			
			evento.setCoordX((float) 46);
			evento.setCoordY((float) 11);
			
			eventi.add(evento);
			
			// System.out.println ("************* title = " + titolo);
			
			repoEvent.save(evento);
			
		}
		
		// System.out.println ("************* " + eventi.size());
		
		// repoEvent.save(eventi);

		// System.out.println ("****" + repoEvent.count());
	}
}
