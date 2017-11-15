Build/Run
---------
mvn clean package -Dmaven.test.skip=true
java -Dserver.contextPath=/trentorienta -Dserver.port=7016 -jar target/trentorientaService-1.0.0.jar

WSDL Address
------------
http://localhost:7016/trentorienta/soapservice/service/wsdl/service.wsdl