import Func "mo:base/Func";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

actor {
  // Define a type for translation entries
  type TranslationEntry = {
    original: Text;
    translated: Text;
    targetLanguage: Text;
  };

  // Create a stable variable to store translation history
  stable var translationHistory : [TranslationEntry] = [];

  // Function to add a translation to the history
  public func addTranslation(original: Text, translated: Text, targetLanguage: Text) : async () {
    let entry : TranslationEntry = {
      original = original;
      translated = translated;
      targetLanguage = targetLanguage;
    };
    let buffer = Buffer.fromArray<TranslationEntry>(translationHistory);
    buffer.add(entry);
    translationHistory := Buffer.toArray(buffer);
    Debug.print("Translation added to history");
  };

  // Function to get the translation history
  public query func getTranslationHistory() : async [TranslationEntry] {
    return translationHistory;
  };
}
