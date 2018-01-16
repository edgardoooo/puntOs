export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NAME_REGEX = /^([a-zA-Z]{2,}\s[a-zA-z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/;
export const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const HOMETOWN_REGEX = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
export const BUSINESS_NAME_REGEX = /^([A-Za-z0-9'\u2019-]+[\s]?)+$/;
export const USERNAME_REGEX = /^([A-Za-z0-9-_\.])+$/;
export const ZIP_REGEX = /^([0-9]){5}$/;
export const CITY_LIST = ['Adjuntas','Aguada','Aguadilla','Aguas Buenas','Aibonito','Arecibo','Arroyo',
'Anasco','Barceloneta','Barranquitas','Bayamon','Cabo Rojo','Caguas','Camuy','Canovanas','Carolina','Cataño','Cayey','Ceiba',
'Ciales','Cidra','Coamo','Comerio','Corozal','Culebra','Dorado','Fajardo','Florida','Guayama','Guayanilla','Guaynabo',
'Gurabo','Guanica','Hatillo','Hormigueros','Humacao','Isabela','Jayuya','Juana Diaz','Juncos','Lajas','Lares',
'Las Marias','Las Piedras','Loiza','Luquillo','Manatí','Maricao','Maunabo','Mayaguez','Moca','Morovis','Naguabo',
'Naranjito','Orocovis','Patillas','Peñuelas','Ponce','Quebradillas','Rincon','Rio Grande','Sabana Grande','Salinas','San German',
'San Juan','San Lorenzo','San Sebastian','Santa Isabel','Toa Alta','Toa Baja','Trujillo Alto','Utuado','Vega Alta','Vega Baja',
'Vieques','Villalba','Yabucoa','Yauco'];
export const QR_REGEX = /^[a-zA-Z0-9]*$/;
//export const BUSINESS_NAME_REGEX = /^((^[A-Za-z0-9]+[' -]?[A-Za-z0-9]?)\s?)*$/;
