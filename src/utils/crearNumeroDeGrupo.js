const crearNumeroDeGrupo = (nroGrupoMasGrande)=>{
  nroGrupoMasGrande = Number(nroGrupoMasGrande) + 1
  let nroToString = nroGrupoMasGrande.toString()
  while(nroToString.length <= 6){
    nroToString = '0' + nroToString
  }
  return nroToString
}

module.exports ={crearNumeroDeGrupo}