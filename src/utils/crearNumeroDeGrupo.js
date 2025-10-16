const crearNumeroDeGrupo = (cantidadDeGrupos)=>{
  cantidadDeGrupos +=1
  let nroToString = cantidadDeGrupos.toString()
  while(nroToString.length <= 6){
    nroToString = '0' + nroToString
  }
  return nroToString
}

module.exports ={crearNumeroDeGrupo}