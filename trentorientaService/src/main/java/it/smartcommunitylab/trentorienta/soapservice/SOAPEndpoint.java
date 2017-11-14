package it.smartcommunitylab.trentorienta.soapservice;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import io.swagger.annotations.ApiOperation;
import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepositoryCustom;

@Endpoint
public class SOAPEndpoint {

	private static final Logger LOGGER = LoggerFactory.getLogger(SOAPEndpoint.class);

	@Autowired
	private EventTypeRepositoryCustom repo1;

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
	public ResponseList getThemeList(@RequestPayload ThemeRequestList request ) {
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

}