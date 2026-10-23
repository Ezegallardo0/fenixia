package techlab.fenixia.util;

public class Validador {
    
    public static void validarProductos(String nombre, double precio, int stock) {
        if(nombre == null || nombre.isBlank()){
            throw new IllegalArgumentException("El nombre del producto no puede estar vacio.");
        }
        if (precio < 0 ){
            throw new IllegalArgumentException("El precio no puede ser negativo.");
        }
        if(stock < 0){
            throw new IllegalArgumentException("El stock debe ser mayor a 0");
        }
    }
}
