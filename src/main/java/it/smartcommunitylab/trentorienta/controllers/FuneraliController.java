package it.smartcommunitylab.trentorienta.controllers;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import it.smartcommunitylab.trentorienta.funerali.Defunto;
import it.smartcommunitylab.trentorienta.funerali.Funerale;
import it.smartcommunitylab.trentorienta.model.FuneraleDTO;
import it.smartcommunitylab.trentorienta.services.FuneraliService;

@Api("Get funeral data")
@RestController
public class FuneraliController {

	@Autowired
	private FuneraliService service;
	

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMdd");

	@ApiOperation(value = "Get funeral data starting from specified date", produces = "application/xml, application/json")
	@GetMapping("/api/funerali/from")
	public List<FuneraleDTO> getFunerali(@ApiParam(value = "Date to search from, in yyyyMMdd format, defaults to today", required = false) @RequestParam(required = false) String date) throws Exception {
		Instant instant = date != null ? DATE_FORMAT.parse(date).toInstant() : Instant.now();
		return service.getFunerale(instant).stream().map(f -> new FuneraleDTO(f)).collect(Collectors.toList());
	}
	@ApiOperation(value = "Get funeral data for specific date", produces = "application/xml, application/json")
	@GetMapping("api/funerali/day")
	public List<FuneraleDTO> getFuneraliDay(@ApiParam(value = "Day to search for, in yyyyMMdd format, defaults to today", required = false) @RequestParam(required = false) String date) throws Exception {
		Instant instant = date != null ? DATE_FORMAT.parse(date).toInstant() : Instant.now();
		return service.getFuneraleDay(instant).stream().map(f -> new FuneraleDTO(f)).collect(Collectors.toList());
	}
	@ApiOperation(value = "Get funeral data for person", produces = "application/xml, application/json")
	@GetMapping("/api/funerali/defunto")
	public List<Defunto> getDefunto(@ApiParam(value = "Person to search for", required = true) @RequestParam String name) throws Exception {
		return service.getDefunto(name);
	}

}
