export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white mt-10 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
        ℹ️ About & Dataset Info
      </h2>

      <p className="text-gray-700 leading-relaxed mb-4">
        Questo progetto utilizza il dataset{" "}
        <strong>California Housing Prices</strong>, fornito dal{" "}
        <a
          href="https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          repository di Scikit-learn
        </a>.  
        Il dataset raccoglie informazioni sui prezzi medi delle abitazioni in
        California (anni ’90) e include variabili socio-economiche e
        geografiche come:
      </p>

      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li><strong>latitude / longitude</strong> – coordinate geografiche</li>
        <li><strong>housing_median_age</strong> – età mediana delle abitazioni</li>
        <li><strong>total_rooms / total_bedrooms</strong> – numero medio di stanze</li>
        <li><strong>population / households</strong> – densità abitativa</li>
        <li><strong>median_income</strong> – reddito medio (in decine di migliaia di $)</li>
        <li><strong>ocean_proximity</strong> – distanza dal mare</li>
      </ul>

      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        🧠 Modello di Machine Learning
      </h3>

      <p className="text-gray-700 leading-relaxed mb-4">
        Il modello impiegato è una <strong>Regressione Lineare</strong> creata
        con <code>scikit-learn</code>.  
        Durante il training sono state eseguite:
      </p>

      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>Rimozione outlier su variabili chiave (valore casa, età, reddito)</li>
        <li>Normalizzazione delle feature numeriche</li>
        <li>Encoding della variabile categorica <code>ocean_proximity</code></li>
        <li>Split del dataset (80% training / 20% test)</li>
        <li>Valutazione tramite R², MAE e RMSE</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mb-4">
        Il modello è stato poi integrato in un’API Flask per permettere
        predizioni in tempo reale da un frontend Next.js.  
        L’interfaccia invia i dati in formato JSON, e il backend restituisce il
        valore stimato della casa.
      </p>

      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        🎯 Obiettivo del progetto
      </h3>

      <p className="text-gray-700 leading-relaxed">
        Dimostrare come sia possibile creare un’applicazione completa di{" "}
        <strong>Data Science + Web Development</strong>, unendo un modello di
        machine learning Python a un’interfaccia moderna e reattiva.
      </p>
    </div>
  );
}
