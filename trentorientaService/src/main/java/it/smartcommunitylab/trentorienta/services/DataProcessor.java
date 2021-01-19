package it.smartcommunitylab.trentorienta.services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepository;

@Component
@SuppressWarnings({ "rawtypes", "unchecked" })
public class DataProcessor {

	private static final Logger logger = LoggerFactory.getLogger(DataProcessor.class);
	
	@Autowired
	private EventTypeRepository repoEvent;

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("YYYMMddHHmm");
	
	@Scheduled(initialDelay = 0, fixedRate = 60 * 60 * 1000)
	public void getDataPeriodically() {
		RestTemplate template = new RestTemplate();

		processAvvisiSource(template);
		processAvvisiOggettiRinvenuti(template);
		processAvvisiVideoSource3(template);
		processEventsSource(template);

	}

	private void processAvvisiSource(RestTemplate t) {
		// avvisi del Comune di Trento (limitata a 20 eventi

		HashMap listComune = callRepeat(t,
				"https://www.comune.trento.it/api/opendata/v1/content/class/avviso/offset/0/limit/1000", HashMap.class);

		ArrayList list1 = (ArrayList) listComune.get("nodes");

		for (int i = 0; i < list1.size(); i++) {
			Map<String, Object> riga = (Map<String, Object>) list1.get(i);

			String url = (String) riga.get("link");
			if (url.startsWith("http://")) url = url.replaceFirst("http://", "https://");

			HashMap pagina = callRepeat(t, url, HashMap.class);

			HashMap fields = (HashMap) pagina.get("fields");

			String titolo = (String) ((HashMap) fields.get("titolo")).get("value");

			EventType evento = new EventType();
			evento.setWeb((String) riga.get("fullUrl"));
			evento.setId("avvisi_" + riga.get("nodeId"));

			evento.setTitle(titolo);

			evento.setSource("Avvisi del Comune di Trento");

			String descrizione = (String) ((HashMap) fields.get("descrizione")).get("string_value");
			String abstr = (String) ((HashMap) fields.get("abstract")).get("string_value");
			// for most of the events we have abstract(short description)
			if (descrizione != null && !descrizione.isEmpty()) {
				evento.setDescription((String) descrizione);
			} else {
				evento.setDescription(abstr);
			}
			evento.setShortAbstract(abstr);

			String categoria = "";

			Object value = ((HashMap) fields.get("argomento")).get("value");

			if (value instanceof Boolean) {
				categoria = "Avvisi";
			} else {
				categoria = (String) ((HashMap) value).get("objectName");
				if (categoria == null)
					categoria = "Avvisi";
			}

			evento.setCategory(categoria);
			evento.setThemes(categoria);

			// Object immagine = ((HashMap) fields.get("image")).get("value");
			// if (immagine instanceof Map) {
			// evento.setImage(immagine.toString());
			// }

			Object immagine = ((HashMap) fields.get("image")).get("value");
			if (immagine != null && immagine instanceof String) {
				if (!immagine.toString().isEmpty()) {
					evento.setImage(immagine.toString());
				}
			}

			// event date in seconds epochs
			String eventDate = (String) ((HashMap) fields.get("data")).get("value");
			String dataInizio = DATE_FORMAT.format(new Date(Long.parseLong(eventDate + "000")));
			// evento.setEventDate(dataInizio);

			// evento.setEventStart( new
			// SimpleDateFormat("dd/MM/YYYY").format(new Date((long)
			// Integer.parseInt(eventDate) * 1000)));
			//
			// evento.setEventTiming("");

			ArrayList tags = new ArrayList();
			tags.add(categoria);

			evento.setTags(tags);

			evento.setCoordX(new Float(46.070189));
			evento.setCoordY(new Float(11.120252));

			evento.setCoordinates(new double[] { evento.getCoordX(), evento.getCoordY() });
			evento.setCreated(dataInizio);

			if (fields.containsKey("file")) {
				String file = (String) ((HashMap) fields.get("file")).get("value");
				evento.setFile(file);
			}
			
			evento.setAddress("Comune di Trento");

			repoEvent.save(evento);
		}
	}

	private void processEventsSource(RestTemplate t) {
		// call
		// https://os.smartcommunitylab.it/comuneintasca-multi/events/TrentoInTasca
		// transform data
		// save to db
		Map<String, Object> input = new HashMap<>();
		input.put("fromTime", new Date().getTime());

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> request = new HttpEntity<>(input, headers);
		ArrayList list = t.postForObject(
				"https://os.smartcommunitylab.it/comuneintasca-multi/events/TrentoInTasca", request, ArrayList.class);


		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> riga = (Map<String, Object>) list.get(i);

			EventType evento = new EventType();

			// converto i valori nei campi di destinazione
			evento.setId((String) riga.get("id"));
			// evento.setSource((String) riga.get("source"));
			evento.setSource("Eventi del Comune di Trento");

			String titolo = (String) ((LinkedHashMap) riga.get("title")).get("it");

			evento.setTitle((String) titolo);
			evento.setWeb((String) riga.get("url"));

			String descrizione = (String) ((LinkedHashMap) riga.get("description")).get("it");
			String abstr = riga.containsKey("subtitle") ? (String) ((LinkedHashMap) riga.get("subtitle")).get("it")
					: null;

			// for most of the events we have abstract(short description)
			if (descrizione != null && !descrizione.isEmpty()) {
				evento.setDescription((String) descrizione);
			} else {
				evento.setDescription(abstr);
			}
			evento.setShortAbstract(abstr);

			String cat = (String) riga.get("category");
			if (cat == null)
				cat = "Evento";

			evento.setCategory(cat);

			evento.setImage((String) riga.get("image"));
			evento.setWeb((String) riga.get("fullUrl"));
			ArrayList topics = (ArrayList) riga.get("topics");
			evento.setTags(topics);
			String tema = (String) riga.get("eventType");
			if (tema == null)
				tema = "Tema generico";
			evento.setThemes(tema);

			// String periodo = (String) (
			// (LinkedHashMap)riga.get("eventPeriod") ).get("it");
			String durata = (String) ((LinkedHashMap) riga.get("eventTiming")).get("it");

			// evento.setEventStart(periodo);
			evento.setEventTiming(durata);

			evento.setEventStart(DATE_FORMAT.format(new Date(Long.valueOf(riga.get("fromTime").toString()))));
			
			evento.setToTime(Long.valueOf(riga.get("toTime").toString()));

			evento.setCreated(
					DATE_FORMAT.format(Long.valueOf(riga.get("lastModified").toString())));

			// Ottengo le coordinate dell'evento
			// https://os.smartcommunitylab.it/core.geocoder/spring/address?address=
			// INDIRIZZO

			Map<String, String> input2 = new HashMap<String, String>();

			String indirizzo = (String) ((LinkedHashMap) riga.get("address")).get("it");

			input2.put("address", indirizzo);
			input2.put("latlng", "46.070135,11.120045");
			input2.put("distance", "10");

			// System.out.println("\n\n****" + indirizzo);

			evento.setAddress(indirizzo);

			RestTemplate template1 = new RestTemplate();
			HashMap list1 = template1.getForObject(
					"https://os.smartcommunitylab.it/core.geocoder/spring/address?address={address}&latlng={latlng}&distance={distance}&rows=1",
					HashMap.class, input2);

			try {
				String coord = (String) ((LinkedHashMap) ((ArrayList) ((LinkedHashMap) list1.get("response"))
						.get("docs")).get(0)).get("coordinate");

				evento.setCoordX(Float.parseFloat(coord.split(",")[0]));
				evento.setCoordY(Float.parseFloat(coord.split(",")[1]));
			} catch (Exception e) {
				evento.setCoordX(new Float(46.070189));
				evento.setCoordY(new Float(11.120252));
			}

			evento.setCoordinates(new double[] { evento.getCoordX(), evento.getCoordY() });
			
			repoEvent.save(evento);

		}
	}

	private void processAvvisiVideoSource3(RestTemplate t) {
		// call
		// http://www.comune.trento.it/api/opendata/v1/content/class/ezflowmedia/offset/0/limit/100
		// transform data
		// save to db

		HashMap listComune = callRepeat(t, 
				"https://www.comune.trento.it/api/opendata/v1/content/class/ezflowmedia/offset/0/limit/100",
				HashMap.class);

		ArrayList list = (ArrayList) listComune.get("nodes");

		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> riga = (Map<String, Object>) list.get(i);

			String url = (String) riga.get("link");
			if (url.startsWith("http://")) url = url.replaceFirst("http://", "https://");

			HashMap pagina = callRepeat(t, url, HashMap.class);
			HashMap fields = (HashMap) pagina.get("fields");

			EventType evento = new EventType();
			evento.setWeb((String) riga.get("fullUrl"));
			evento.setId("avvisi_" + riga.get("nodeId"));
			evento.setSource("Video di TrentoInforma");
			String titolo = String.valueOf(riga.get("objectName"));
			evento.setTitle((String) titolo);
			evento.setWeb((String) riga.get("fullUrl"));
			String descrizione = (String) ((LinkedHashMap) fields.get("descrizione")).get("string_value");
			String abstr = (String) ((LinkedHashMap) fields.get("abstract")).get("string_value");

			
			// video link
			if (riga != null && riga.containsKey("objectId") && fields.containsKey("ezflowmedia")) {
				String objectId = String.valueOf(riga.get("objectId"));
				HashMap video = (HashMap) fields.get("ezflowmedia");
				if (video.containsKey("id")) {
					String videoLink = "https://www.comune.trento.it/content/download/" + objectId + "/"
							+ video.get("id") + "/video";
					evento.setVideoLink(videoLink);
				}
			}
			
			// for most of the events we have abstract(short description)
			if (descrizione != null && !descrizione.isEmpty()) {
				evento.setDescription((String) descrizione);
			} else {
				evento.setDescription(abstr);
			}

			evento.setShortAbstract(abstr);
			// category.
			String categoria = "";
			HashMap argomento = ((HashMap) fields.get("argomento"));
			if (argomento != null && argomento.containsKey("value")) {
				if (argomento.get("value") instanceof Boolean) {
					categoria = "Avvisi";
				} else {
					HashMap value = (HashMap) argomento.get("value");
					if (value != null && value.containsKey("objectName")) {
						categoria = String.valueOf(value.get("objectName"));
					}
					if (value.containsKey("path") && value.get("path") instanceof ArrayList) {
						ArrayList tags = (ArrayList) value.get("path");
						evento.setTags(tags);
					}
				}
			}

			if (categoria == null | categoria.isEmpty()) {
				categoria = "Avvisi";
			}

			evento.setCategory(categoria);
			evento.setThemes(categoria);
			HashMap imageMap = (HashMap) fields.get("image");
			if (imageMap != null && imageMap.containsKey("value") && !(imageMap.get("value") instanceof Boolean)) {
				evento.setImage(String.valueOf(imageMap.get("value")));
			}
			HashMap durataMap = (LinkedHashMap) fields.get("durata");
			if (durataMap != null && durataMap.containsKey("value") && !(durataMap.get("value") instanceof Boolean)) {
				String durata = String.valueOf(durataMap.get("value"));
				evento.setEventTiming(durata);
			}
			evento.setCoordX(new Float(46.070189));
			evento.setCoordY(new Float(11.120252));

			evento.setCoordinates(new double[] { evento.getCoordX(), evento.getCoordY() });
			
			evento.setAddress("Comune di Trento");

			evento.setCreated(DATE_FORMAT
					.format(new Date(Long.parseLong(riga.get("dateModified").toString() + "000"))));

			repoEvent.save(evento);

		}
	}

	private void processAvvisiOggettiRinvenuti(RestTemplate t) {
		// source url:
		// http://www.comune.trento.it/api/opendata/v1/content/class/avviso_oggetti_rinvenuti/offset/0/limit/100

		HashMap listComune = callRepeat(t, 
				"https://www.comune.trento.it/api/opendata/v1/content/class/avviso_oggetti_rinvenuti/offset/0/limit/100",
				HashMap.class);

		ArrayList list1 = (ArrayList) listComune.get("nodes");

		for (int i = 0; i < list1.size(); i++) {
			Map<String, Object> riga = (Map<String, Object>) list1.get(i);

			String url = (String) riga.get("link");
			if (url.startsWith("http://")) url = url.replaceFirst("http://", "https://");

			HashMap pagina = callRepeat(t, url, HashMap.class);

			HashMap fields = (HashMap) pagina.get("fields");

			String titolo = (String) ((HashMap) fields.get("titolo")).get("value");

			EventType evento = new EventType();
			evento.setWeb((String) riga.get("fullUrl"));
			evento.setId("avvisi_" + riga.get("nodeId"));

			evento.setTitle(titolo);

			evento.setSource("Avvisi oggetti rinvenuti");

			String descrizione = (String) ((HashMap) fields.get("descrizione")).get("value");
			descrizione = descrizione.replace("\n", "");
			String abstr = (String) ((HashMap) fields.get("abstract")).get("value");
			abstr = abstr.replace("\n", "");
			// in this case the most relevant description is that of abstract.
			if (abstr != null && !abstr.isEmpty()) {
				evento.setDescription(descrizione + abstr);
			} else {
				evento.setDescription(descrizione);
			}
			evento.setShortAbstract(abstr);

			String categoria = "";

			Object value = ((HashMap) fields.get("argomento")).get("value");

			if (value instanceof Boolean) {
				categoria = "Avvisi";
			} else {
				categoria = (String) ((HashMap) value).get("objectName");
				if (categoria == null)
					categoria = "Avvisi";
			}

			evento.setCategory(categoria);
			evento.setThemes(categoria);

			// Object immagine = ((HashMap) fields.get("image")).get("value");
			// if (immagine instanceof Map) {
			// evento.setImage(immagine.toString());
			// }
			Object immagine = ((HashMap) fields.get("image")).get("value");
			if (immagine != null && immagine instanceof String) {
				if (!immagine.toString().isEmpty()) {
					evento.setImage(immagine.toString());
				}
			}

			String eventDate = (String) ((HashMap) fields.get("data")).get("value");
			String dataInizio = DATE_FORMAT.format(new Date(Long.parseLong(eventDate + "000")));

			ArrayList tags = new ArrayList();
			tags.add(categoria);

			evento.setTags(tags);

			// System.out.println( ( (HashMap) fields.get("gps") ).get("value")
			// );

			evento.setCoordX(new Float(46.070189));
			evento.setCoordY(new Float(11.120252));
			evento.setCoordinates(new double[] { evento.getCoordX(), evento.getCoordY() });
			evento.setCreated(dataInizio);

			evento.setAddress("Comune di Trento");

			repoEvent.save(evento);
		}
	}

	
	private static <T> T callRepeat(RestTemplate restTemplate, String url, Class<T> cls) {
		try {
			return restTemplate.getForObject(url, cls);
		} catch (Exception e) {
			logger.warn("error retriving url {}, retryung", url);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e1) {
			}
			return restTemplate.getForObject(url, cls);
		}
	}
}
