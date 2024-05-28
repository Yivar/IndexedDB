class UsuarioDBManager {
    constructor(dbName, dbVersion) {
      this.dbName = dbName;
      this.dbVersion = dbVersion;
      this.db = null;
    }
  
    abrirConexion() {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.dbName, this.dbVersion);
  
        request.onupgradeneeded = (event) => {
          this.db = event.target.result;
          const objectStore = this.db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
  
          objectStore.createIndex("nombre", "nombre", { unique: false });
          objectStore.createIndex("apellido", "apellido", { unique: false });
          objectStore.createIndex("numeroCelular", "numeroCelular", { unique: true });
          objectStore.createIndex("fechaNacimiento", "fechaNacimiento", { unique: false });
          objectStore.createIndex("pais", "pais", { unique: false });
          objectStore.createIndex("direccion", "direccion", { unique: false });
        };
  
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    crear(usuario) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["usuarios"], "readwrite");
        const objectStore = transaction.objectStore("usuarios");
        const request = objectStore.add(usuario);
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    leer(id) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["usuarios"], "readonly");
        const objectStore = transaction.objectStore("usuarios");
        const request = objectStore.get(id);
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    actualizar(usuario) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["usuarios"], "readwrite");
        const objectStore = transaction.objectStore("usuarios");
        const request = objectStore.put(usuario);
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    eliminar(id) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["usuarios"], "readwrite");
        const objectStore = transaction.objectStore("usuarios");
        const request = objectStore.delete(id);
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  
    listarTodos() {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["usuarios"], "readonly");
        const objectStore = transaction.objectStore("usuarios");
        const request = objectStore.openCursor();
        const usuarios = [];
  
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            usuarios.push(cursor.value);
            cursor.continue();
          } else {
            resolve(usuarios);
          }
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  }
  
  // Ejemplo de uso
  const dbManager = new UsuarioDBManager("miBaseDatos", 1);
  
  dbManager.abrirConexion()
    .then(() => {
      const nuevoUsuario = {
        nombre: "Juan",
        apellido: "Pérez",
        numeroCelular: "1234567890",
        fechaNacimiento: "1990-05-15",
        pais: "España",
        direccion: "Calle Falsa 123"
      };
  
      return dbManager.crear(nuevoUsuario);
    })
    .then((id) => {
      console.log("Usuario creado con ID:", id);
      return dbManager.leer(id);
    })
    .then((usuario) => {
      console.log("Usuario obtenido:", usuario);
      usuario.apellido = "Rodríguez";
      return dbManager.actualizar(usuario);
    })
    .then(() => {
      console.log("Usuario actualizado correctamente");
      return dbManager.listarTodos();
    })
    .then((usuarios) => {
      console.log("Todos los usuarios:", usuarios);
      return dbManager.eliminar(usuarios[0].id);
    })
    .then(() => {
      console.log("Usuario eliminado correctamente");
    })
    .catch((error) => {
      console.error("Error:", error);
    });