import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "http://localhost:8081/auth",
 realm: "newrealm",
 clientId: "next-frontend",
});

//console.log('keycloak', keycloak);

export default keycloak;
