package it.smartcommunitylab.trentorienta.soapservice;

import javax.xml.bind.annotation.XmlValue;
import javax.xml.bind.annotation.XmlAttribute;
 
public class MyMapEntryType {
 
   @XmlAttribute
   public String key; 
 
   @XmlValue
   public Integer value;
 
}