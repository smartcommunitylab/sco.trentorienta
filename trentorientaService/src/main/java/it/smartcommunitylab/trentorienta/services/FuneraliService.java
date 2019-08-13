/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.trentorienta.services;

import java.time.Instant;
import java.util.List;

import javax.xml.datatype.DatatypeFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;

import it.smartcommunitylab.trentorienta.funerali.Defunto;
import it.smartcommunitylab.trentorienta.funerali.Funerale;
import it.smartcommunitylab.trentorienta.funerali.GetDefunto;
import it.smartcommunitylab.trentorienta.funerali.GetDefuntoResponse;
import it.smartcommunitylab.trentorienta.funerali.GetFunerale;
import it.smartcommunitylab.trentorienta.funerali.GetFuneraleDay;
import it.smartcommunitylab.trentorienta.funerali.GetFuneraleDayResponse;
import it.smartcommunitylab.trentorienta.funerali.GetFuneraleResponse;

/**
 * @author raman
 *
 */
public class FuneraliService extends WebServiceGatewaySupport {

	protected static final Logger log = LoggerFactory.getLogger(FuneraliService.class);

	public List<Funerale> getFunerale(Instant instant) throws Exception {
		GetFunerale request = new GetFunerale();
		request.setData(DatatypeFactory.newInstance().newXMLGregorianCalendar(instant.toString()));
		GetFuneraleResponse response = (GetFuneraleResponse) getWebServiceTemplate().marshalSendAndReceive(request);
		return response.getGetFuneraleReturn();
	}

	public List<Defunto> getDefunto(String name) throws Exception {
		GetDefunto request = new GetDefunto();
		request.setNominativo(name);
		GetDefuntoResponse response = (GetDefuntoResponse) getWebServiceTemplate().marshalSendAndReceive(request);
		return response.getGetDefuntoReturn();
	}

	public List<Funerale> getFuneraleDay(Instant instant) throws Exception {
		GetFuneraleDay request = new GetFuneraleDay();
		request.setData(DatatypeFactory.newInstance().newXMLGregorianCalendar(instant.toString()));
		GetFuneraleDayResponse response = (GetFuneraleDayResponse) getWebServiceTemplate().marshalSendAndReceive(request);
		return response.getGetFuneraleDayReturn();
	}

}
