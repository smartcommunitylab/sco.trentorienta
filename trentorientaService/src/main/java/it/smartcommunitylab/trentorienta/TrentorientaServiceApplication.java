package it.smartcommunitylab.trentorienta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.google.common.base.Predicates;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
public class TrentorientaServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrentorientaServiceApplication.class, args);
	}

	@Bean
	public Docket newsApi() {
				.paths(Predicates.not(PathSelectors.regex("/error"))).build();
	}

	private ApiInfo apiInfo() {
				.description(
						"This page contains an interactive representation of the TrentOrienta project's API using Swagger.")
				.contact("SmartCommunity Lab FBK-ICT.").build();
	}
}
