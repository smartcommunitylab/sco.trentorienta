package it.smartcommunitylab.trentorienta.soapservice;

import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepositoryCustom;

@Endpoint
public class SOAPEndpoint {

	private static final Logger LOGGER = LoggerFactory.getLogger(SOAPEndpoint.class);

	@Autowired
	private EventTypeRepositoryCustom repo1;

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmm");

	private static final String NAMESPACE_URI = "http://smartcommunitylab.it/trentorienta/soapservice";

	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "person")
	@ResponsePayload
	public Greeting sayHello(@RequestPayload Person request) {
		LOGGER.info("Endpoint received person[firstName={},lastName={}]", request.getFirstName(),
				request.getLastName());

		String greeting = "Hello " + request.getFirstName() + " " + request.getLastName() + "!";

		ObjectFactory factory = new ObjectFactory();
		Greeting response = factory.createGreeting();
		response.setGreeting(greeting);

		LOGGER.info("Endpoint sending greeting='{}'", response.getGreeting());
		return response;
	}

	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "requestList")
	@ResponsePayload
	public ResponseList getSourceList(@RequestPayload RequestList request) {

		ResponseList response = new ResponseList();
		response.setMap(repo1.getSources());

		return response;

	}

	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "tagRequestList")
	@ResponsePayload
	public ResponseList getTagList(@RequestPayload TagRequestList request) {

		ResponseList response = new ResponseList();
		response.setMap(repo1.getTags());

		return response;

	}

	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "themeRequestList")
	@ResponsePayload
	public ResponseList getThemeList(@RequestPayload ThemeRequestList request) {
		ResponseList response = new ResponseList();
		response.setMap(repo1.getThemes());

		return response;

	}

	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "eventRequest")
	@ResponsePayload
	public EventType getEvent(@RequestPayload EventRequest eventRequest) {

		EventType response = null;
		response = repo1.findEvent(eventRequest.getId());

		return response;

	}

	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "searchRequest")
	@ResponsePayload
	public EventTypeList getAllEventsWithSearchRequest(@RequestPayload SearchRequest searchRequest)
			throws ParseException {

		Page<EventType> pageList = null;
		EventTypeList list = new EventTypeList();

		BigInteger start = searchRequest.getStart() == null ? BigInteger.valueOf(0) : searchRequest.getStart();
		BigInteger size = searchRequest.getSize() == null ? BigInteger.valueOf(15) : searchRequest.getSize();
		
		Date fromDate = null;
		if (searchRequest.getFromDateStr() != null && !searchRequest.getFromDateStr().isEmpty()) {
			fromDate = StringUtils.isEmpty(searchRequest.getFromDateStr()) ? null
					: DATE_FORMAT.parse(searchRequest.getFromDateStr());
		}
		
		BigInteger sortForList = searchRequest.getSortForList() == null ? BigInteger.valueOf(1) : searchRequest.getSortForList();

		if (sortForList.intValue() == 1)
			pageList = repo1.findAllEventType(searchRequest.getThemes().toArray(new String[0]),
					searchRequest.getSource().toArray(new String[0]), searchRequest.getTag().toArray(new String[0]),
					fromDate, true, searchRequest.getFilter(), new PageRequest(start.intValue()  / size.intValue() , size.intValue() ));
		else
			pageList = repo1.findAllEventType(searchRequest.getThemes().toArray(new String[0]),
					searchRequest.getSource().toArray(new String[0]), searchRequest.getTag().toArray(new String[0]),
					fromDate, false, searchRequest.getFilter(), new PageRequest(start.intValue()  / size.intValue() , size.intValue() ));

		list.setEventType(pageList.getContent());

		return list;
	}

}