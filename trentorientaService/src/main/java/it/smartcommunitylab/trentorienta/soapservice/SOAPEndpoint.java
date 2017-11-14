package it.smartcommunitylab.trentorienta.soapservice;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

@Endpoint
public class SOAPEndpoint {

  private static final Logger LOGGER = LoggerFactory.getLogger(SOAPEndpoint.class);

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
}