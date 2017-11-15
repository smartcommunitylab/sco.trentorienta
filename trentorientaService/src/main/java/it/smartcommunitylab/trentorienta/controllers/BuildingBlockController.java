package it.smartcommunitylab.trentorienta.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.namespace.QName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.autentia.web.rest.wadl.builder.ApplicationBuilder;
import com.autentia.web.rest.wadl.builder.impl.springframework.SpringWadlBuilderFactory;
import com.autentia.xml.schema.SchemaBuilder;

import io.swagger.annotations.ApiOperation;
import it.smartcommunitylab.usdl.generator.USDLService;
import net.java.dev.wadl._2009._02.Application;
import net.java.dev.wadl._2009._02.Method;
import net.java.dev.wadl._2009._02.Representation;
import net.java.dev.wadl._2009._02.Resource;
import springfox.documentation.annotations.ApiIgnore;

@Controller
public class BuildingBlockController {

	private final ApplicationBuilder applicationBuilder;
	private final SchemaBuilder schemaBuilder;
	private USDLService usdlService;
	private static final List<String> specs = Arrays.asList("xwadl", "wsdl", "usdl", "swagger");

	@PostConstruct
	public void BuildingBlockController() {
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("artifact-reference.yml");
		usdlService = new USDLService(is);
	}

	@Autowired
	public BuildingBlockController(RequestMappingHandlerMapping handlerMapping) {
		final SpringWadlBuilderFactory wadlBuilderFactory = new SpringWadlBuilderFactory(handlerMapping);
		applicationBuilder = wadlBuilderFactory.getApplicationBuilder();
		schemaBuilder = wadlBuilderFactory.getSchemaBuilder();
	}

	@ApiOperation(value = "spec/list")
	@RequestMapping(value = "spec/list", method = RequestMethod.GET)
	@ResponseBody
	public List<String> getSpecList(HttpServletResponse response) {
		return specs;
	}

	@ResponseBody
	@RequestMapping(value = "spec/usdl", method = RequestMethod.GET, produces = { "application/rdf+xml" })
	public String generateUSDL(HttpServletRequest request) {
		return usdlService.generateBB();
	}

	@RequestMapping(value = "spec/swagger", method = RequestMethod.GET)
	public void generateSpec(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.sendRedirect(request.getContextPath() + "/swagger-ui.html");
	}

	@ApiOperation(value = "spec/xwadl")
	@ResponseBody
	@RequestMapping(value = "spec/xwadl", method = RequestMethod.GET, produces = { "application/xml" })
	public Application generateWadl(HttpServletRequest request) {
		Application application = applicationBuilder.build("https://tn.smartcommunitylab.it");

		/**
		 * its a bug of marketplace, it expect resources to be available inside
		 * <resource path="<applicationName>"> <resource op1>
		 * <request/> <response> <representation mediaType="/"/> </response>
		 * </resource> <resource op2> </resource> </resource>
		 */
		Resource trentOrienta = new Resource();
		trentOrienta.setPath(request.getContextPath());

		for (Resource temp : application.getResources().get(0).getResource()) {
			if (temp.getPath().startsWith("/api/")) {

				Representation representation = new Representation();
				representation.getOtherAttributes().put(QName.valueOf("mediaType"), "*/*");

				Method method = (Method) temp.getMethodOrResource().get(0);
				method.getResponse().get(0).getRepresentation().add(representation);
				trentOrienta.getAny().add(temp);
			}
		}

		application.getResources().get(0).getResource().clear();
		application.getResources().get(0).getResource().add(trentOrienta);

		return application;
	}

	@ApiOperation(value = "spec/wsdl")
	@ResponseBody
	@RequestMapping(value = "spec/wsdl", method = RequestMethod.GET, produces = { "application/xml" })
	public void generateWSDL(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.sendRedirect(request.getContextPath() + "/soapservice/service/wsdl/service.wsdl");
	}

	@ApiIgnore
	@ResponseBody
	@RequestMapping(value = "schema/{classTypeName}", method = RequestMethod.GET)
	public String generateSchema(@PathVariable String classTypeName) {
		return schemaBuilder.buildFor(classTypeName);
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(IllegalArgumentException.class)
	public void handleException() {
		// Do nothing, just magic annotations.
	}
}