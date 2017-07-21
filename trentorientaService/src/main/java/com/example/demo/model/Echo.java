package com.example.demo.model;

import org.springframework.data.annotation.Id;

public class Echo {

	@Id
	private String id;
	
	private String message;
	private boolean testbool;

	public boolean isTestbool() {
		return testbool;
	}

	public void setTestbool(boolean testbool) {
		this.testbool = testbool;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	
}
