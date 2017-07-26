package com.example.demo.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Echo;
import com.example.demo.model.EventType;
import com.example.demo.repository.EchoRepository;
import com.example.demo.repository.EventTypeRepositoryCustom;

@RestController	
public class TestController {

	@Autowired
	private EchoRepository repo;
	@Autowired
	private EventTypeRepositoryCustom repo1;
	
	@GetMapping("/api/echo")
	public @ResponseBody List<Echo> echo() {
		Echo echo = new Echo();
		echo.setMessage("Ciao");
				
		repo.save(echo);
		
		return repo.findByMessage("Ciao");
	}
	
	@CrossOrigin(origins = "*")
	@GetMapping("/api/events")
	public @ResponseBody Page<EventType> getAllEvents(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size,
			@RequestParam(required=false) String[] source,
			@RequestParam(required=false) String[] tag,
			@RequestParam(required=false) String[] themes
			) {
		if (start == null) start = 0;
		if (size == null) size = 15;
		return repo1.findAllEventType(themes, source, tag, new PageRequest(start / size, size));
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/event")
	public @ResponseBody EventType getEvent(
			@RequestParam(value="id") String id
			) {
		
		return repo1.findEvent(id);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/themes")
	public @ResponseBody Map<String, Integer> getThemeList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getThemes();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/tags")
	public @ResponseBody Map<String, Integer> getTagList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getTags();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/sources")
	public @ResponseBody Map<String, Integer> getSourceList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getSources();
	}
	
	
}
