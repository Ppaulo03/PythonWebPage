function Clear_solution() {
    var lista = document.getElementById("clear_sol").getAttribute("lista");
    if (lista.length > 2) {
        var lista = lista.slice(1, -1)
        var lista = lista.match(/.{1,8}/g)
        var marked = new Array()
        lista.forEach(cord => {
            cord = cord.slice(1, 5)
            cord = cord.split(", ")
            var nome = "(" + cord[1] + ", " + cord[0] + ")";
            marked.push(nome)
        });
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                var nome = "(" + x + ", " + y + ")";
                if (marked.includes(nome) == false) {
                    document.getElementById(nome).value = ""
                }
            }
        }

    }
}
