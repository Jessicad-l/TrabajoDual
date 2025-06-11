document.addEventListener('DOMContentLoaded', function() {
    const tabla = document.getElementById('tabla-horarios').getElementsByTagName('tbody')[0];
    const btnAgregar = document.getElementById('agregar-empleado');
    
    // Contador para IDs únicos
    let contadorEmpleados = 1;
    
    // Generar opciones de horas (de 00:00 a 23:30 en intervalos de 30 minutos)
    function generarOpcionesHoras(selectElement, horaSeleccionada = '08:00') {
        selectElement.innerHTML = '';
        
        for (let hora = 0; hora < 24; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                const horaFormateada = hora.toString().padStart(2, '0');
                const minutoFormateado = minuto.toString().padStart(2, '0');
                const valor = `${horaFormateada}:${minutoFormateado}`;
                
                const option = document.createElement('option');
                option.value = valor;
                option.textContent = valor;
                option.selected = valor === horaSeleccionada;
                selectElement.appendChild(option);
            }
        }
    }
    
    // Calcular horas trabajadas entre dos horas
    function calcularHorasTrabajadas(horaInicio, horaFin) {
        const [hIni, mIni] = horaInicio.split(':').map(Number);
        const [hFin, mFin] = horaFin.split(':').map(Number);
        
        let totalMinutos = (hFin * 60 + mFin) - (hIni * 60 + mIni);
        
        // Si la hora fin es menor que la inicio, asumimos que es del día siguiente
        if (totalMinutos < 0) {
            totalMinutos += 24 * 60;
        }
        
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        
        if (minutos === 0) {
            return `${horas}h`;
        } else {
            return `${horas}h ${minutos}m`;
        }
    }
    
    // Actualizar las horas trabajadas en una fila
    function actualizarHorasTrabajadas(fila) {
        const selectEntrada = fila.querySelector('.select-entrada');
        const selectSalida = fila.querySelector('.select-salida');
        const celdaHoras = fila.querySelector('.horas-trabajadas');
        
        celdaHoras.textContent = calcularHorasTrabajadas(
            selectEntrada.value,
            selectSalida.value
        );
    }
    
    // Agregar un nuevo empleado a la tabla
    function agregarEmpleado() {
        const fila = document.createElement('tr');
        const idEmpleado = `empleado-${contadorEmpleados++}`;
        
        fila.innerHTML = `
            <td>
                <input type="text" class="nombre-empleado" placeholder="Nombre empleado" value="Empleado ${contadorEmpleados}">
            </td>
            <td>
                <select class="select-entrada"></select>
            </td>
            <td>
                <select class="select-salida"></select>
            </td>
            <td class="horas-trabajadas">8h</td>
            <td>
                <button class="btn-eliminar">Eliminar</button>
            </td>
        `;
        
        // Generar opciones para los selects
        const selectEntrada = fila.querySelector('.select-entrada');
        const selectSalida = fila.querySelector('.select-salida');
        
        generarOpcionesHoras(selectEntrada, '08:00');
        generarOpcionesHoras(selectSalida, '17:00');
        
        // Event listeners para actualizar automáticamente las horas trabajadas
        selectEntrada.addEventListener('change', () => actualizarHorasTrabajadas(fila));
        selectSalida.addEventListener('change', () => actualizarHorasTrabajadas(fila));
        
        // Event listener para el botón eliminar
        fila.querySelector('.btn-eliminar').addEventListener('click', () => {
            fila.remove();
        });
        
        tabla.appendChild(fila);
        actualizarHorasTrabajadas(fila);
    }
    
    // Agregar empleado inicial
    agregarEmpleado();
    
    // Event listener para el botón agregar empleado
    btnAgregar.addEventListener('click', agregarEmpleado);
});
