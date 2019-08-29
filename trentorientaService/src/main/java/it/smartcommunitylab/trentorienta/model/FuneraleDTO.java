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
package it.smartcommunitylab.trentorienta.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

import org.apache.commons.lang3.StringUtils;

import it.smartcommunitylab.trentorienta.funerali.Funerale;

/**
 * @author raman
 *
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Funerale", propOrder = {
    "dataFunerale",
    "dataMorte",
    "luogoFunerale",
    "nome",
    "oraFunerale",
    "comune",
    "dataPartenza",
    "oraParenza"
})
public class FuneraleDTO {
    @XmlElement(name = "data_funerale", required = true, nillable = true)
    protected String dataFunerale;
    @XmlElement(name = "data_morte", required = true, nillable = true)
    protected String dataMorte;
    @XmlElement(name = "luogo_funerale", required = true, nillable = true)
    protected String luogoFunerale;
    @XmlElement(required = true, nillable = true)
    protected String nome;
    @XmlElement(name = "ora_funerale", required = true, nillable = true)
    protected String oraFunerale;
    @XmlElement(name = "ora_partenza", required = true, nillable = true)
    protected String oraPartenza;
    @XmlElement(name = "data_partenza", required = true, nillable = true)
    protected String dataPartenza;
    @XmlElement(name = "comune", required = true, nillable = true)
    protected String comune;
    
    
	public FuneraleDTO() {
		super();
	}
	
	public FuneraleDTO(Funerale funerale) {
		super();
		setNome(funerale.getNome());
		setDataMorte(funerale.getDataMorte());
		if (funerale.getLuogoFunerale() != null && funerale.getLuogoFunerale().startsWith("TRENTO -  - ")) {
			setComune("TRENTO");
			setDataFunerale(funerale.getDataFunerale());
			setOraFunerale(funerale.getOraFunerale());
			setLuogoFunerale(funerale.getLuogoFunerale().replace("TRENTO -  - ", ""));
		} else {
			String[] arr = funerale.getLuogoFunerale().split("-  -");
			if (arr.length == 2) {
				setComune(arr[0].trim());
				String luogo = arr[1].trim().replace("PARTENZA PER", "");
				if (StringUtils.isEmpty(luogo)) luogo = getComune();
				setLuogoFunerale(luogo);
			} else {
				setComune(funerale.getLuogoFunerale());
				setLuogoFunerale(funerale.getLuogoFunerale());
			}
			setDataPartenza(funerale.getDataFunerale());
			setOraPartenza(funerale.getOraFunerale());
		}
	}
	
	public String getDataFunerale() {
		return dataFunerale;
	}
	public void setDataFunerale(String dataFunerale) {
		this.dataFunerale = dataFunerale;
	}
	public String getDataMorte() {
		return dataMorte;
	}
	public void setDataMorte(String dataMorte) {
		this.dataMorte = dataMorte;
	}
	public String getLuogoFunerale() {
		return luogoFunerale;
	}
	public void setLuogoFunerale(String luogoFunerale) {
		this.luogoFunerale = luogoFunerale;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getOraFunerale() {
		return oraFunerale;
	}
	public void setOraFunerale(String oraFunerale) {
		this.oraFunerale = oraFunerale;
	}
	public String getOraPartenza() {
		return oraPartenza;
	}
	public void setOraPartenza(String oraPartenza) {
		this.oraPartenza = oraPartenza;
	}
	public String getDataPartenza() {
		return dataPartenza;
	}
	public void setDataPartenza(String dataPartenza) {
		this.dataPartenza = dataPartenza;
	}
	public String getComune() {
		return comune;
	}
	public void setComune(String comune) {
		this.comune = comune;
	}

	@Override
	public String toString() {
		return "FuneraleDTO [dataFunerale=" + dataFunerale + ", dataMorte=" + dataMorte + ", luogoFunerale="
				+ luogoFunerale + ", nome=" + nome + ", oraFunerale=" + oraFunerale + ", oraPartenza=" + oraPartenza
				+ ", dataPartenza=" + dataPartenza + ", comune=" + comune + "]";
	}

	
}
