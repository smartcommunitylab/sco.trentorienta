package it.smartcommunitylab.trentorienta.controllers;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
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

import net.java.dev.wadl._2009._02.Application;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@Controller
@RequestMapping(value = "/service")
@Order(7)
public class WadlController {

	private final ApplicationBuilder applicationBuilder;
	private final SchemaBuilder schemaBuilder;

	@Autowired
	public WadlController(RequestMappingHandlerMapping handlerMapping) {
		final SpringWadlBuilderFactory wadlBuilderFactory = new SpringWadlBuilderFactory(handlerMapping);
		applicationBuilder = wadlBuilderFactory.getApplicationBuilder();
		schemaBuilder = wadlBuilderFactory.getSchemaBuilder();
	}

	@RequestMapping(value = "spec/swagger", method = RequestMethod.GET)
	public void generateSpec(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.sendRedirect( request.getContextPath()+ "/swagger-ui.html");
	}

	@ResponseBody
	@RequestMapping(value = "spec/xwadl", method = RequestMethod.GET, produces = { "application/xml" })
	public Application generateWadl(HttpServletRequest request) {
		return applicationBuilder.build("https://tn.smartcommunitylab.it/trentorienta");
	}

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