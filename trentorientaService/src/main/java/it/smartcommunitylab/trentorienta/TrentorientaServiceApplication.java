package it.smartcommunitylab.trentorienta;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.SimpleWsdl11Definition;
import org.springframework.ws.wsdl.wsdl11.Wsdl11Definition;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@Configuration
@EnableSwagger2
@EnableScheduling
@EnableWs
public class TrentorientaServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrentorientaServiceApplication.class, args);
	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("TrentOrienta REST API with Swagger").version("1.0")
				.description(
						"This page contains an interactive representation of the TrentOrienta project's API using Swagger."
								+ " The project has been published as 5* building block conforming to welive consortium metamodel specification."
								+ " The project has been released as opensource project on GitHub."
								+ " For detailed information about API usage and source code visit"
								+ " <a href=\"https://github.com/smartcommunitylab/sco.trentorienta/wiki/Trento-Informer-(Trento-Orienta)\" target=\"_blank\"> Project WIKI </a>")
				.version("1.0").termsOfServiceUrl("http://redmine.welive.eu/documents/58")
				.contact("SmartCommunity Lab FBK-ICT.").build();
	}

	@Bean
	public Docket newsApi() {
		return new Docket(DocumentationType.SWAGGER_2).select()
				.apis(RequestHandlerSelectors.basePackage("it.smartcommunitylab.trentorienta.controllers")).build()
				.apiInfo(apiInfo());
	}

	@Configuration
	public class WebConfig extends WebMvcConfigurerAdapter {
		@Override
		public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
			MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
			List<MediaType> list = new ArrayList<>();
			list.add(MediaType.APPLICATION_JSON_UTF8);
			list.add(new MediaType("text", "html", Charset.forName("UTF-8")));
			list.add(new MediaType("application", "*+json", Charset.forName("UTF-8")));
			converter.setSupportedMediaTypes(list);
			converters.add(converter);
		}
	}

	@Bean
	public ServletRegistrationBean messageDispatcherServlet(ApplicationContext applicationContext) {
		MessageDispatcherServlet servlet = new MessageDispatcherServlet();
		servlet.setApplicationContext(applicationContext);

		return new ServletRegistrationBean(servlet, "/soapservice/*");
	}

	@Bean(name = "service")
	public Wsdl11Definition defaultWsdl11Definition() {
		SimpleWsdl11Definition wsdl11Definition = new SimpleWsdl11Definition();
		wsdl11Definition.setWsdl(new ClassPathResource("/wsdl/trentorienta.wsdl"));

		return wsdl11Definition;
	}

}
