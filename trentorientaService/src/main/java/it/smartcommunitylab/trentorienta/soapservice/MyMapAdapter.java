package it.smartcommunitylab.trentorienta.soapservice;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import javax.xml.bind.annotation.adapters.XmlAdapter;
  
public final class MyMapAdapter extends
  
   XmlAdapter<MyMapType,Map<String, Integer>> {
  
   @Override
   public MyMapType marshal(Map<String, Integer> arg0) throws Exception {
      MyMapType myMapType = new MyMapType();
      for(Entry<String, Integer> entry : arg0.entrySet()) {
         MyMapEntryType myMapEntryType = 
            new MyMapEntryType();
         myMapEntryType.key = entry.getKey();
         myMapEntryType.value = entry.getValue();
         myMapType.entry.add(myMapEntryType);
      }
      return myMapType;
   }
  
   @Override
   public Map<String, Integer> unmarshal(MyMapType arg0) throws Exception {
      HashMap<String, Integer> hashMap = new HashMap<String, Integer>();
      for(MyMapEntryType myEntryType : arg0.entry) {
         hashMap.put(myEntryType.key, myEntryType.value);
      }
      return hashMap;
   }
  
}