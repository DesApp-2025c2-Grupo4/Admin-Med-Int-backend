const crearCredencial = (nroGrupo, cantIntegrantes) =>{
  //Creo mi nro de integrante
  const miNro = cantIntegrantes <9 ?
    `0${cantIntegrantes+1}`:
    cantIntegrantes+1

  //Creo la credencial
  const credencial = `${nroGrupo}-${miNro}`

  //Retorno
  return credencial
}
module.exports = {
  crearCredencial
}