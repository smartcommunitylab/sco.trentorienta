package com.example.demo.model;

import java.util.List;

import org.springframework.data.annotation.Id;

public class EventType {

	@Id
	private String id;
	
	private String source;   // sorgenti
	private String title;
	private String description;
	private String category;      // temi
	private String image;
	private String eventStart;
	private String eventTiming;
	private String themes;
	private List<String> tags;  // etichette
	private String eventDate;
	private Float coordX;
	private Float coordY;
	private String created;
	private String eventoDate;
	private String createdDate;
	
	public String getEventDate() {
		return eventDate;
	}
	public void setEventDate(String fromTime) {
		this.eventDate = fromTime;
	}
	public String getToTime() {
		return toTime;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public void setToTime(String toTime) {
		this.toTime = toTime;
	}
	private String toTime;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getEventStart() {
		return eventStart;
	}
	public void setEventStart(String eventPeriod) {
		this.eventStart = eventPeriod;
	}
	public String getEventTiming() {
		return eventTiming;
	}
	public void setEventTiming(String eventTiming) {
		this.eventTiming = eventTiming;
	}
	public String getThemes() {
		return themes;
	}
	public void setThemes(String themes) {
		this.themes = themes;
	}
	public Float getCoordX() {
		return coordX;
	}
	public void setCoordX(Float coordX) {
		this.coordX = coordX;
	}
	public Float getCoordY() {
		return coordY;
	}
	public void setCoordY(Float coordY) {
		this.coordY = coordY;
	}
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}
	public String getEventoDate() {
		return eventoDate;
	}
	public void setEventoDate(String eventoDate) {
		this.eventoDate = eventoDate;
	}
	public String getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}
	
	
}
