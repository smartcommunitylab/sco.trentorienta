package it.smartcommunitylab.trentorienta.controllers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.model.SearchRequest;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepositoryCustom;
import it.smartcommunitylab.trentorienta.services.DataProcessor;

@RestController
public class DataController {

	@Autowired
	private EventTypeRepositoryCustom repo1;
	
	@Autowired
	private DataProcessor dataProcessor;

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmm");

	@ApiOperation(value = "getAllEvents", nickname = "getAllEvents", produces = "application/xml, application/json")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value = "/api/events")
	public @ResponseBody Page<EventType> getAllEvents(
			@ApiParam(value = "Page number.", required = false) @RequestParam(required = false, defaultValue = "0") Integer start,
			@ApiParam(value = "Number of events to show in page.", required = false, defaultValue = "15") @RequestParam(required = false) Integer size,
			@ApiParam(value = "Array source for e.g. (Avvisi del Comune di Trento,Eventi del Comune di Trento).", required = false) @RequestParam(required = false) String[] source,
			@ApiParam(value = "Array tags for e.g. (Economia e diritto,Sport).", required = false) @RequestParam(required = false) String[] tag,
			@ApiParam(value = "Array themes for e.g. (Formazione, Economia e diritto).", required = false) @RequestParam(required = false) String[] themes,
			@ApiParam(value = "YYYYMMddhhmm (201710130916)", required = false) @RequestParam(required = false) String fromDateStr,
			@ApiParam(value = "Sorting Order 1-DESC/0-ASC", required = false) @RequestParam(required = false) Integer sortForList,
			@ApiParam(value = "Filter text", required = false) @RequestParam(required = false) String filter,
			@ApiParam(value = "Filter text", required = false) @RequestParam(required = false) String lat,
			@ApiParam(value = "Filter text", required = false) @RequestParam(required = false) String lon,
			@ApiParam(value = "Filter text", required = false) @RequestParam(required = false) String radius)
			throws ParseException {
		Date fromDate = StringUtils.isEmpty(fromDateStr) ? null : DATE_FORMAT.parse(fromDateStr);
		
		Boolean sortForListB = sortForList == null ? null : sortForList == 1 ? true : false;
		
			return repo1.findAllEventType(themes, source, tag, fromDate, sortForListB, filter, lat, lon, radius,
					new PageRequest(start / size, size));
	}

	@ApiOperation(value = "getAllEventsWithSearchRequest", nickname = "getAllEventsWithSearchRequest", produces = "application/xml, application/json")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST, value = "/api/events")
	@PostMapping("/api/events")
	public @ResponseBody Page<EventType> getAllEventsWithSearchRequest(
			@ApiParam(value = "search body", required = true) @RequestBody SearchRequest params) throws ParseException {
		int start = params.getStart() == null ? 0 : params.getStart();
		int size = params.getSize() == null ? 15 : params.getSize();

		Date fromDate = StringUtils.isEmpty(params.getFromDate()) ? null : DATE_FORMAT.parse(params.getFromDate());

		Boolean sortForList = params.getSortForList() == null ? null : params.getSortForList() == 1 ? true : false;

		return repo1.findAllEventType(params.getThemes(), params.getSource(), params.getTag(), fromDate, sortForList,
				params.getFilter(), params.getLat(), params.getLon(), params.getRadius(), new PageRequest(start / size, size));
	}

	@ApiOperation(value = "getEvent", nickname = "getEvent", produces = "application/xml, application/json")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value = "/api/event")
	public @ResponseBody EventType getEvent(
			@ApiParam(value = "Event id (avvisi_1126997)", required = true) @RequestParam(value = "id") String id) {

		return repo1.findEvent(id);
	}

	@ApiOperation(value = "getThemeList", nickname = "getThemeList", produces = "application/xml, application/json")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value = "/api/themes")
	public @ResponseBody Map<String, Integer> getThemeList(
			@ApiParam(value = "Page number.", required = false) @RequestParam(required = false) Integer start,
			@ApiParam(value = "Number of events to show in page.", required = false) @RequestParam(required = false) Integer size) {
		if (start == null)
			start = 0;
		if (size == null)
			size = 5;
		return repo1.getThemes();
	}

	@ApiOperation(value = "getTagList", nickname = "getTagList", produces = "application/xml, application/json")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value = "/api/tags")
	public @ResponseBody Map<String, Integer> getTagList(
			@ApiParam(value = "Page number.", required = false) @RequestParam(required = false) Integer start,
			@ApiParam(value = "Number of events to show in page.", required = false) @RequestParam(required = false) Integer size) {
		if (start == null)
			start = 0;
		if (size == null)
			size = 5;
		return repo1.getTags();
	}

	@ApiOperation(value = "getSourceList", nickname = "getSourceList", produces = "application/xml, application/json")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value = "/api/sources")
	public @ResponseBody Map<String, Integer> getSourceList(
			@ApiParam(value = "Page number.", required = false) @RequestParam(required = false) Integer start,
			@ApiParam(value = "Number of events to show in page.", required = false) @RequestParam(required = false) Integer size) {
		if (start == null)
			start = 0;
		if (size == null)
			size = 5;
		return repo1.getSources();
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/api/update")
	public void updateEvent() {
		dataProcessor.getDataPeriodically();
	}
	

}
