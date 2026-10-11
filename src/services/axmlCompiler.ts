/**
 * Android Binary XML (AXML) Compiler
 * Converts Android Manifest XML structures into standard compiled Android Binary XML format
 * conforming to Android AssetManager / AXmlResourceParser specifications.
 * This eliminates the "พบปัญหาในการแยกวิเคราะห์แพ็คเกจ" (Parse Error) on Android devices.
 */

export interface ManifestData {
  packageName: string;
  versionCode: number;
  versionName: string;
  minSdkVersion: number;
  targetSdkVersion: number;
  appName: string;
  permissions: string[];
  hardwareAccelerated: boolean;
}

export class AxmlCompiler {
  // Android Attribute Resource IDs from android.R.attr
  public static readonly ATTR_THEME = 0x01010000;
  public static readonly ATTR_LABEL = 0x01010001;
  public static readonly ATTR_ICON = 0x01010002;
  public static readonly ATTR_NAME = 0x01010003;
  public static readonly ATTR_PERMISSION = 0x01010006;
  public static readonly ATTR_EXPORTED = 0x01010010;
  public static readonly ATTR_VERSION_CODE = 0x0101021b;
  public static readonly ATTR_VERSION_NAME = 0x0101021c;
  public static readonly ATTR_MIN_SDK_VERSION = 0x0101020c;
  public static readonly ATTR_TARGET_SDK_VERSION = 0x01010270;
  public static readonly ATTR_HARDWARE_ACCELERATED = 0x010102d3;
  public static readonly ATTR_CONFIG_CHANGES = 0x0101001f;
  public static readonly ATTR_WINDOW_SOFT_INPUT_MODE = 0x0101022b;
  public static readonly ATTR_ALLOW_BACKUP = 0x01010280;

  // Chunk Types
  private static readonly RES_XML_TYPE = 0x00080003;
  private static readonly RES_STRING_POOL_TYPE = 0x001c0001;
  private static readonly RES_XML_RESOURCE_MAP_TYPE = 0x00080180;
  private static readonly RES_XML_START_NAMESPACE_TYPE = 0x00100100;
  private static readonly RES_XML_END_NAMESPACE_TYPE = 0x00100101;
  private static readonly RES_XML_START_ELEMENT_TYPE = 0x00100102;
  private static readonly RES_XML_END_ELEMENT_TYPE = 0x00100103;

  /**
   * Compile ManifestData into valid binary AXML Uint8Array
   */
  public static compile(data: ManifestData): Uint8Array {
    // Collect all strings used in manifest
    const strings: string[] = [];
    const stringMap = new Map<string, number>();

    const addString = (s: string): number => {
      if (stringMap.has(s)) return stringMap.get(s)!;
      const idx = strings.length;
      strings.push(s);
      stringMap.set(s, idx);
      return idx;
    };

    // Pre-populate core XML namespace & elements
    const URI_ANDROID = 'http://schemas.android.com/apk/res/android';
    const PREFIX_ANDROID = 'android';

    addString(URI_ANDROID); // 0
    addString(PREFIX_ANDROID); // 1
    addString('manifest'); // 2
    addString('package'); // 3
    addString('versionCode'); // 4
    addString('versionName'); // 5
    addString('uses-sdk'); // 6
    addString('minSdkVersion'); // 7
    addString('targetSdkVersion'); // 8
    addString('uses-permission'); // 9
    addString('name'); // 10
    addString('application'); // 11
    addString('label'); // 12
    addString('icon'); // 13
    addString('allowBackup'); // 14
    addString('hardwareAccelerated'); // 15
    addString('activity'); // 16
    addString('exported'); // 17
    addString('configChanges'); // 18
    addString('intent-filter'); // 19
    addString('action'); // 20
    addString('category'); // 21
    addString('android.intent.action.MAIN'); // 22
    addString('android.intent.category.LAUNCHER'); // 23
    addString('orientation|keyboardHidden|screenSize'); // 24
    addString('.MainActivity'); // 25
    addString('@mipmap/ic_launcher'); // 26

    // Add dynamic strings
    addString(data.packageName);
    addString(data.versionName);
    addString(data.appName);
    for (const p of data.permissions) {
      addString(p);
    }

    // Build String Pool Chunk (UTF-16)
    const stringPoolChunk = this.buildStringPoolChunk(strings);

    // Build Resource Map Chunk
    const resourceMapChunk = this.buildResourceMapChunk(strings, stringMap);

    // Build XML Body (Namespace & Elements)
    const xmlBodyChunks = this.buildXmlBodyChunks(data, stringMap);

    // Total file size
    const headerSize = 8;
    const totalSize = headerSize + stringPoolChunk.length + resourceMapChunk.length + xmlBodyChunks.length;

    const axmlBuffer = new Uint8Array(totalSize);
    const view = new DataView(axmlBuffer.buffer);

    // Write AXML Header
    view.setUint32(0, this.RES_XML_TYPE, true);
    view.setUint32(4, totalSize, true);

    let offset = 8;
    axmlBuffer.set(stringPoolChunk, offset);
    offset += stringPoolChunk.length;

    axmlBuffer.set(resourceMapChunk, offset);
    offset += resourceMapChunk.length;

    axmlBuffer.set(xmlBodyChunks, offset);

    return axmlBuffer;
  }

  /**
   * Builds the RES_STRING_POOL chunk in UTF-16 format
   */
  private static buildStringPoolChunk(strings: string[]): Uint8Array {
    const stringOffsets: number[] = [];
    const encodedStrings: Uint8Array[] = [];

    let currentStringOffset = 0;
    for (const s of strings) {
      stringOffsets.push(currentStringOffset);
      // UTF-16LE: 2 bytes length, then chars (2 bytes each), then null terminator (2 bytes)
      const len = s.length;
      const buf = new Uint8Array((len + 2) * 2);
      const v = new DataView(buf.buffer);
      v.setUint16(0, len, true);
      for (let i = 0; i < len; i++) {
        v.setUint16((i + 1) * 2, s.charCodeAt(i), true);
      }
      v.setUint16((len + 1) * 2, 0, true);
      encodedStrings.push(buf);
      currentStringOffset += buf.length;
    }

    // Padding strings data to 4 bytes boundary
    const padSize = (4 - (currentStringOffset % 4)) % 4;

    const stringCount = strings.length;
    const headerSize = 28;
    const stringsStart = headerSize + stringCount * 4;
    const totalChunkSize = stringsStart + currentStringOffset + padSize;

    const chunk = new Uint8Array(totalChunkSize);
    const view = new DataView(chunk.buffer);

    view.setUint16(0, 0x0001, true); // type RES_STRING_POOL_TYPE
    view.setUint16(2, headerSize, true); // header size 28
    view.setUint32(4, totalChunkSize, true); // chunkSize
    view.setUint32(8, stringCount, true); // stringCount
    view.setUint32(12, 0, true); // styleCount = 0
    view.setUint32(16, 0, true); // flags: UTF-16
    view.setUint32(20, stringsStart, true); // stringsStart offset
    view.setUint32(24, 0, true); // stylesStart = 0

    // Write offsets
    let off = headerSize;
    for (let i = 0; i < stringCount; i++) {
      view.setUint32(off, stringOffsets[i], true);
      off += 4;
    }

    // Write string bytes
    for (const b of encodedStrings) {
      chunk.set(b, off);
      off += b.length;
    }

    return chunk;
  }

  /**
   * Builds the RES_XML_RESOURCE_MAP chunk mapping string indices to android attributes
   */
  private static buildResourceMapChunk(strings: string[], map: Map<string, number>): Uint8Array {
    // Only attribute strings are mapped
    const attrMap: { strIndex: number; resId: number }[] = [];

    const reg = (name: string, id: number) => {
      if (map.has(name)) {
        attrMap.push({ strIndex: map.get(name)!, resId: id });
      }
    };

    reg('label', this.ATTR_LABEL);
    reg('icon', this.ATTR_ICON);
    reg('name', this.ATTR_NAME);
    reg('versionCode', this.ATTR_VERSION_CODE);
    reg('versionName', this.ATTR_VERSION_NAME);
    reg('minSdkVersion', this.ATTR_MIN_SDK_VERSION);
    reg('targetSdkVersion', this.ATTR_TARGET_SDK_VERSION);
    reg('hardwareAccelerated', this.ATTR_HARDWARE_ACCELERATED);
    reg('exported', this.ATTR_EXPORTED);
    reg('configChanges', this.ATTR_CONFIG_CHANGES);
    reg('allowBackup', this.ATTR_ALLOW_BACKUP);

    const count = strings.length;
    const headerSize = 8;
    const chunkSize = headerSize + count * 4;
    const chunk = new Uint8Array(chunkSize);
    const view = new DataView(chunk.buffer);

    view.setUint16(0, 0x0180, true); // RES_XML_RESOURCE_MAP_TYPE
    view.setUint16(2, headerSize, true);
    view.setUint32(4, chunkSize, true);

    // Initialize mapping array
    const idMap = new Map<number, number>();
    for (const a of attrMap) {
      idMap.set(a.strIndex, a.resId);
    }

    let off = 8;
    for (let i = 0; i < count; i++) {
      view.setUint32(off, idMap.get(i) || 0, true);
      off += 4;
    }

    return chunk;
  }

  /**
   * Build XML Nodes: Namespaces and Elements
   */
  private static buildXmlBodyChunks(data: ManifestData, map: Map<string, number>): Uint8Array {
    const chunks: Uint8Array[] = [];

    const uriAndroid = map.get('http://schemas.android.com/apk/res/android')!;
    const prefixAndroid = map.get('android')!;

    // 1. Start Namespace
    chunks.push(this.buildNamespaceChunk(this.RES_XML_START_NAMESPACE_TYPE, prefixAndroid, uriAndroid));

    // 2. Start <manifest>
    const manifestAttrs: AttributeData[] = [
      {
        ns: -1,
        name: map.get('package')!,
        rawVal: map.get(data.packageName)!,
        type: 3, // TYPE_STRING
        data: map.get(data.packageName)!,
      },
      {
        ns: uriAndroid,
        name: map.get('versionCode')!,
        rawVal: -1,
        type: 16, // TYPE_INT_DEC
        data: data.versionCode,
      },
      {
        ns: uriAndroid,
        name: map.get('versionName')!,
        rawVal: map.get(data.versionName)!,
        type: 3, // TYPE_STRING
        data: map.get(data.versionName)!,
      },
    ];
    chunks.push(this.buildStartElementChunk(map.get('manifest')!, manifestAttrs));

    // 3. <uses-sdk>
    const sdkAttrs: AttributeData[] = [
      {
        ns: uriAndroid,
        name: map.get('minSdkVersion')!,
        rawVal: -1,
        type: 16,
        data: data.minSdkVersion,
      },
      {
        ns: uriAndroid,
        name: map.get('targetSdkVersion')!,
        rawVal: -1,
        type: 16,
        data: data.targetSdkVersion,
      },
    ];
    chunks.push(this.buildStartElementChunk(map.get('uses-sdk')!, sdkAttrs));
    chunks.push(this.buildEndElementChunk(map.get('uses-sdk')!));

    // 4. <uses-permission> entries
    for (const perm of data.permissions) {
      const permAttrs: AttributeData[] = [
        {
          ns: uriAndroid,
          name: map.get('name')!,
          rawVal: map.get(perm)!,
          type: 3,
          data: map.get(perm)!,
        },
      ];
      chunks.push(this.buildStartElementChunk(map.get('uses-permission')!, permAttrs));
      chunks.push(this.buildEndElementChunk(map.get('uses-permission')!));
    }

    // 5. Start <application>
    const appAttrs: AttributeData[] = [
      {
        ns: uriAndroid,
        name: map.get('label')!,
        rawVal: map.get(data.appName)!,
        type: 3,
        data: map.get(data.appName)!,
      },
      {
        ns: uriAndroid,
        name: map.get('icon')!,
        rawVal: map.get('@mipmap/ic_launcher')!,
        type: 1, // TYPE_REFERENCE to @mipmap/ic_launcher
        data: 0x7f030000,
      },
      {
        ns: uriAndroid,
        name: map.get('allowBackup')!,
        rawVal: -1,
        type: 18, // TYPE_INT_BOOLEAN
        data: 1,
      },
      {
        ns: uriAndroid,
        name: map.get('hardwareAccelerated')!,
        rawVal: -1,
        type: 18,
        data: data.hardwareAccelerated ? 1 : 0,
      },
    ];
    chunks.push(this.buildStartElementChunk(map.get('application')!, appAttrs));

    // 6. Start <activity>
    const activityAttrs: AttributeData[] = [
      {
        ns: uriAndroid,
        name: map.get('name')!,
        rawVal: map.get('.MainActivity')!,
        type: 3,
        data: map.get('.MainActivity')!,
      },
      {
        ns: uriAndroid,
        name: map.get('label')!,
        rawVal: map.get(data.appName)!,
        type: 3,
        data: map.get(data.appName)!,
      },
      {
        ns: uriAndroid,
        name: map.get('exported')!,
        rawVal: -1,
        type: 18,
        data: 1, // exported = true for main launcher activity
      },
      {
        ns: uriAndroid,
        name: map.get('configChanges')!,
        rawVal: map.get('orientation|keyboardHidden|screenSize')!,
        type: 3,
        data: map.get('orientation|keyboardHidden|screenSize')!,
      },
    ];
    chunks.push(this.buildStartElementChunk(map.get('activity')!, activityAttrs));

    // 7. <intent-filter>
    chunks.push(this.buildStartElementChunk(map.get('intent-filter')!, []));

    // 8. <action android:name="android.intent.action.MAIN" />
    chunks.push(this.buildStartElementChunk(map.get('action')!, [
      {
        ns: uriAndroid,
        name: map.get('name')!,
        rawVal: map.get('android.intent.action.MAIN')!,
        type: 3,
        data: map.get('android.intent.action.MAIN')!,
      },
    ]));
    chunks.push(this.buildEndElementChunk(map.get('action')!));

    // 9. <category android:name="android.intent.category.LAUNCHER" />
    chunks.push(this.buildStartElementChunk(map.get('category')!, [
      {
        ns: uriAndroid,
        name: map.get('name')!,
        rawVal: map.get('android.intent.category.LAUNCHER')!,
        type: 3,
        data: map.get('android.intent.category.LAUNCHER')!,
      },
    ]));
    chunks.push(this.buildEndElementChunk(map.get('category')!));

    // End <intent-filter>
    chunks.push(this.buildEndElementChunk(map.get('intent-filter')!));

    // End <activity>
    chunks.push(this.buildEndElementChunk(map.get('activity')!));

    // End <application>
    chunks.push(this.buildEndElementChunk(map.get('application')!));

    // End <manifest>
    chunks.push(this.buildEndElementChunk(map.get('manifest')!));

    // End Namespace
    chunks.push(this.buildNamespaceChunk(this.RES_XML_END_NAMESPACE_TYPE, prefixAndroid, uriAndroid));

    // Concatenate all chunks
    const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLen);
    let offset = 0;
    for (const c of chunks) {
      result.set(c, offset);
      offset += c.length;
    }
    return result;
  }

  private static buildNamespaceChunk(type: number, prefix: number, uri: number): Uint8Array {
    const chunk = new Uint8Array(24);
    const view = new DataView(chunk.buffer);
    view.setUint16(0, type, true);
    view.setUint16(2, 16, true); // headerSize
    view.setUint32(4, 24, true); // chunkSize
    view.setUint32(8, 1, true); // lineNumber
    view.setUint32(12, 0xffffffff, true); // comment
    view.setUint32(16, prefix, true);
    view.setUint32(20, uri, true);
    return chunk;
  }

  private static buildStartElementChunk(name: number, attrs: AttributeData[]): Uint8Array {
    const attrSize = 20;
    const headerSize = 36;
    const totalChunkSize = headerSize + attrs.length * attrSize;

    const chunk = new Uint8Array(totalChunkSize);
    const view = new DataView(chunk.buffer);

    view.setUint16(0, 0x0102, true); // RES_XML_START_ELEMENT_TYPE
    view.setUint16(2, 16, true); // headerSize
    view.setUint32(4, totalChunkSize, true); // chunkSize
    view.setUint32(8, 1, true); // lineNumber
    view.setUint32(12, 0xffffffff, true); // comment
    view.setUint32(16, 0xffffffff, true); // ns = none
    view.setUint32(20, name, true); // name
    view.setUint16(24, 20, true); // attributeStart
    view.setUint16(26, attrSize, true); // attributeSize
    view.setUint16(28, attrs.length, true); // attributeCount
    view.setUint16(30, 0, true); // idIndex
    view.setUint16(32, 0, true); // classIndex
    view.setUint16(34, 0, true); // styleIndex

    let off = headerSize;
    for (const a of attrs) {
      view.setUint32(off, a.ns === -1 ? 0xffffffff : a.ns, true);
      view.setUint32(off + 4, a.name, true);
      view.setUint32(off + 8, a.rawVal === -1 ? 0xffffffff : a.rawVal, true);
      view.setUint16(off + 12, 8, true); // TypedValue size = 8
      view.setUint8(off + 14, 0); // res0
      view.setUint8(off + 15, a.type); // dataType
      view.setUint32(off + 16, a.data, true); // data
      off += attrSize;
    }

    return chunk;
  }

  private static buildEndElementChunk(name: number): Uint8Array {
    const chunk = new Uint8Array(24);
    const view = new DataView(chunk.buffer);
    view.setUint16(0, 0x0103, true); // RES_XML_END_ELEMENT_TYPE
    view.setUint16(2, 16, true);
    view.setUint32(4, 24, true);
    view.setUint32(8, 1, true);
    view.setUint32(12, 0xffffffff, true);
    view.setUint32(16, 0xffffffff, true); // ns = none
    view.setUint32(20, name, true); // name
    return chunk;
  }
}

interface AttributeData {
  ns: number;
  name: number;
  rawVal: number;
  type: number;
  data: number;
}
